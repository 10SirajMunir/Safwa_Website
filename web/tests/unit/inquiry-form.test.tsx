import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { InquiryForm, type FabricChoice } from "@/components/forms/inquiry-form";

const fabrics: FabricChoice[] = [
  {
    slug: "cotton-twill-180-gsm",
    code: "AS-201",
    label: "Cotton Twill 180 GSM",
    colours: [
      { name: "Navy", code: "AS-201-NV" },
      { name: "Khaki", code: "AS-201-KH" },
    ],
  },
];

async function fillContactDetails(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Your name"), "Ahmed Khan");
  await user.type(screen.getByLabelText("Phone or WhatsApp"), "0300 1234567");
  await user.type(screen.getByLabelText("City"), "Lahore");
}

afterEach(() => {
  vi.unstubAllGlobals();
  window.location.hash = "";
});

describe("InquiryForm", () => {
  it("shows errors and focuses the first invalid field instead of sending", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<InquiryForm variant="fabric" fabrics={fabrics} defaultFabric="cotton-twill-180-gsm" />);

    await user.click(screen.getByRole("button", { name: "Request quote" }));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByText("Please enter your name.")).toBeInTheDocument();
    expect(screen.getByLabelText("Your name")).toHaveFocus();
    expect(screen.getByLabelText("Your name")).toHaveAttribute("aria-invalid", "true");
  });

  it("blocks quantities below the MOQ", async () => {
    vi.stubGlobal("fetch", vi.fn());
    const user = userEvent.setup();
    render(<InquiryForm variant="fabric" fabrics={fabrics} defaultFabric="cotton-twill-180-gsm" />);
    await fillContactDetails(user);
    await user.click(screen.getByLabelText(/Navy/));
    await user.type(screen.getByLabelText("Meters per colour"), "50");
    await user.click(screen.getByRole("button", { name: "Request quote" }));

    expect(screen.getByText("Minimum order is 100 meters per colour.")).toBeInTheDocument();
  });

  it("sends a quote with the fabric, chosen colours and meters, then thanks the buyer", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 202 }));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<InquiryForm variant="fabric" fabrics={fabrics} defaultFabric="cotton-twill-180-gsm" />);

    await fillContactDetails(user);
    await user.click(screen.getByLabelText(/Navy/));
    await user.click(screen.getByLabelText(/Khaki/));
    await user.type(screen.getByLabelText("Meters per colour"), "250");
    await user.click(screen.getByRole("button", { name: "Request quote" }));

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/inquiries");
    expect(JSON.parse(init.body)).toEqual({
      type: "quote",
      name: "Ahmed Khan",
      city: "Lahore",
      phone: "0300 1234567",
      company_website: "",
      fabric: "AS-201 Cotton Twill 180 GSM",
      colours: "Navy (AS-201-NV), Khaki (AS-201-KH)",
      meters: "250",
    });
    const status = await screen.findByRole("status");
    expect(within(status).getByText(/Thank you, Ahmed Khan/)).toBeInTheDocument();
  });

  it("switches to sample mode from the #order-sample link and hides meters", () => {
    window.location.hash = "#order-sample";
    render(<InquiryForm variant="fabric" fabrics={fabrics} defaultFabric="cotton-twill-180-gsm" />);
    expect(screen.getByLabelText("A sample")).toBeChecked();
    expect(screen.queryByLabelText("Meters per colour")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Request sample" })).toBeInTheDocument();
  });

  it("shows server field errors and a retry message when the server rejects", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ error: "Please check the highlighted fields.", fields: { city: "Unknown city" } }), {
          status: 422,
        }),
      ),
    );
    const user = userEvent.setup();
    render(<InquiryForm variant="contact" />);
    await fillContactDetails(user);
    await user.type(screen.getByLabelText("Your message"), "Do you stock satin?");
    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Please check the highlighted fields.");
    expect(screen.getByText("Unknown city")).toBeInTheDocument();
  });

  it("tells the buyer when the network fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));
    const user = userEvent.setup();
    render(<InquiryForm variant="contact" />);
    await fillContactDetails(user);
    await user.type(screen.getByLabelText("Your message"), "Hello there");
    await user.click(screen.getByRole("button", { name: "Send message" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/check your connection/);
  });
});

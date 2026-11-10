import type { Finish, FabricType, FabricUse, Weave } from "@/types/fabric";
import type { GuideCategory } from "@/types/content";

export const fabricTypeLabels: Record<FabricType, string> = {
  cotton: "Cotton",
  "poly-cotton": "Poly-cotton",
};

export const weaveLabels: Record<Weave, string> = {
  twill: "Twill",
  plain: "Plain",
  satin: "Satin",
};

export const finishLabels: Record<Finish, string> = {
  peach: "Peach finish",
  mercerised: "Mercerised",
};

export const useLabels: Record<FabricUse, string> = {
  shirts: "Shirts",
  uniforms: "Uniforms",
  kurtas: "Kurtas",
  trousers: "Trousers",
  "home-textile": "Home textile",
};

export const guideCategoryLabels: Record<GuideCategory, string> = {
  "gsm-guides": "GSM guides",
  "fabric-comparisons": "Fabric comparisons",
  "fabric-uses": "Fabric uses",
};

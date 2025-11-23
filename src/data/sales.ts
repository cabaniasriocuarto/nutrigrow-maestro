import { Sale } from "@/types/fertilizer";

export const SALES_PRINCIPALES: Sale[] = [
  {
    id: "nitrato_calcio",
    nombre: "Nitrato de Calcio (Tetrahidratado)",
    formula: "Ca(NO3)2·4H2O",
    tipo: "macro",
    aporta: {
      "N-NO3": 11.86,
      "Ca": 16.97
    },
    pureza: 99,
    notas: "Tanque A. Principal fuente de Ca + N-NO3. No mezclar directamente con sulfatos o fosfatos."
  },
  {
    id: "nitrato_potasio",
    nombre: "Nitrato de Potasio",
    formula: "KNO3",
    tipo: "macro",
    aporta: {
      "N-NO3": 13.86,
      "K": 38.67
    },
    pureza: 99,
    notas: "Excelente fuente de K + N-NO3. Útil en todas las fases, especialmente floración."
  },
  {
    id: "mkp",
    nombre: "Fosfato Monopotásico (MKP)",
    formula: "KH2PO4",
    tipo: "macro",
    aporta: {
      "P": 22.76,
      "K": 28.73
    },
    pureza: 98,
    notas: "Estrella de floración. Alto P y K sin N. Baja ligeramente el pH."
  },
  {
    id: "nitrato_magnesio",
    nombre: "Nitrato de Magnesio",
    formula: "Mg(NO3)2·6H2O",
    tipo: "macro",
    aporta: {
      "N-NO3": 10.93,
      "Mg": 9.48
    },
    pureza: 99,
    notas: "Fuente de Mg + N-NO3. Altamente soluble."
  },
  {
    id: "sulfato_potasio",
    nombre: "Sulfato de Potasio",
    formula: "K2SO4",
    tipo: "macro",
    aporta: {
      "K": 44.87,
      "S": 18.40
    },
    pureza: 98,
    notas: "K sin Cl ni N. Aporta azufre. Ideal para floración tardía."
  },
  {
    id: "sulfato_magnesio",
    nombre: "Sulfato de Magnesio (Sal de Epsom)",
    formula: "MgSO4·7H2O",
    tipo: "secundario",
    aporta: {
      "Mg": 9.86,
      "S": 13.01
    },
    pureza: 99,
    notas: "Corrección rápida de Mg. Muy soluble. Tanque B preferentemente."
  },
  {
    id: "map",
    nombre: "Fosfato Monoamónico (MAP)",
    formula: "NH4H2PO4",
    tipo: "macro",
    aporta: {
      "N-NH4": 12.17,
      "P": 26.93
    },
    pureza: 98,
    notas: "Alto P + N-NH4. Usar con moderación, especialmente en hidro. Puede bajar pH."
  },
  {
    id: "quelato_fe_edta",
    nombre: "Quelato de Hierro EDTA (13%)",
    formula: "Fe-EDTA",
    tipo: "micro",
    aporta: {
      "Fe": 13.0
    },
    pureza: 100,
    notas: "Quelato estable hasta pH ~6.5. Para suelo/coco. En hidro usar DTPA o EDDHA."
  },
  {
    id: "sulfato_zinc",
    nombre: "Sulfato de Zinc",
    formula: "ZnSO4·7H2O",
    tipo: "micro",
    aporta: {
      "Zn": 22.74,
      "S": 11.15
    },
    pureza: 99,
    notas: "Fuente de Zn. Dosis muy bajas. Exceso tóxico."
  },
  {
    id: "sulfato_manganeso",
    nombre: "Sulfato de Manganeso",
    formula: "MnSO4·H2O",
    tipo: "micro",
    aporta: {
      "Mn": 32.49,
      "S": 18.97
    },
    pureza: 99,
    notas: "Fuente de Mn. Dosis bajas. Controlar en hidro."
  },
  {
    id: "acido_borico",
    nombre: "Ácido Bórico",
    formula: "H3BO3",
    tipo: "micro",
    aporta: {
      "B": 17.48
    },
    pureza: 99,
    notas: "Fuente de boro. Micro-dosis. Rango estrecho entre deficiencia y toxicidad."
  },
  {
    id: "molibdato_sodio",
    nombre: "Molibdato de Sodio",
    formula: "Na2MoO4·2H2O",
    tipo: "micro",
    aporta: {
      "Mo": 39.65,
      "Na": 19.00
    },
    pureza: 99,
    notas: "Fuente de Mo. Cantidades ínfimas. Importante para reducción de nitratos en planta."
  }
];

export const ACIDOS_PH: Sale[] = [
  {
    id: "acido_fosforico",
    nombre: "Ácido Fosfórico (85%)",
    formula: "H3PO4",
    tipo: "ph_down",
    aporta: {
      "P": 26.84
    },
    pureza: 85,
    notas: "pH down típico. Aporta P. Usar con EPP. Añadir sobre agua, NUNCA al revés."
  },
  {
    id: "acido_nitrico",
    nombre: "Ácido Nítrico (65%)",
    formula: "HNO3",
    tipo: "ph_down",
    aporta: {
      "N-NO3": 14.43
    },
    pureza: 65,
    notas: "pH down en crecimiento. Aporta N-NO3. MUY corrosivo. EPP obligatorio."
  },
  {
    id: "carbonato_potasio",
    nombre: "Carbonato de Potasio",
    formula: "K2CO3",
    tipo: "ph_up",
    aporta: {
      "K": 56.57
    },
    pureza: 99,
    notas: "pH up. Aporta K. Usar con cautela, puede elevar mucho el pH."
  }
];

export const ALL_SALES = [...SALES_PRINCIPALES, ...ACIDOS_PH];

import { Target } from "@/types/fertilizer";

export const TARGETS_HIDROPONIA: Target[] = [
  {
    phase: "plantula",
    system: "hidroponia",
    ppm: {
      "N": 80,
      "P": 30,
      "K": 70,
      "Ca": 60,
      "Mg": 25,
      "S": 30
    },
    ecMin: 0.4,
    ecMax: 0.8,
    phMin: 5.5,
    phMax: 6.0
  },
  {
    phase: "vegetativo",
    system: "hidroponia",
    ppm: {
      "N": 180,
      "P": 50,
      "K": 180,
      "Ca": 150,
      "Mg": 50,
      "S": 60
    },
    ecMin: 1.2,
    ecMax: 1.8,
    phMin: 5.5,
    phMax: 6.0
  },
  {
    phase: "floracion_t1",
    system: "hidroponia",
    ppm: {
      "N": 140,
      "P": 80,
      "K": 220,
      "Ca": 160,
      "Mg": 55,
      "S": 65
    },
    ecMin: 1.6,
    ecMax: 2.2,
    phMin: 5.5,
    phMax: 6.0
  },
  {
    phase: "floracion_t2",
    system: "hidroponia",
    ppm: {
      "N": 100,
      "P": 100,
      "K": 260,
      "Ca": 170,
      "Mg": 60,
      "S": 70
    },
    ecMin: 1.8,
    ecMax: 2.4,
    phMin: 5.5,
    phMax: 6.0
  },
  {
    phase: "floracion_t3",
    system: "hidroponia",
    ppm: {
      "N": 60,
      "P": 80,
      "K": 240,
      "Ca": 160,
      "Mg": 55,
      "S": 65
    },
    ecMin: 1.6,
    ecMax: 2.0,
    phMin: 5.5,
    phMax: 6.0
  },
  {
    phase: "flush",
    system: "hidroponia",
    ppm: {
      "N": 0,
      "P": 0,
      "K": 0,
      "Ca": 0,
      "Mg": 0,
      "S": 0
    },
    ecMin: 0.0,
    ecMax: 0.3,
    phMin: 5.8,
    phMax: 6.2
  }
];

export const TARGETS_COCO: Target[] = [
  {
    phase: "plantula",
    system: "coco",
    ppm: {
      "N": 90,
      "P": 35,
      "K": 80,
      "Ca": 70,
      "Mg": 30,
      "S": 35
    },
    ecMin: 0.6,
    ecMax: 1.0,
    phMin: 5.8,
    phMax: 6.3
  },
  {
    phase: "vegetativo",
    system: "coco",
    ppm: {
      "N": 200,
      "P": 55,
      "K": 200,
      "Ca": 170,
      "Mg": 60,
      "S": 70
    },
    ecMin: 1.4,
    ecMax: 2.0,
    phMin: 5.8,
    phMax: 6.3
  },
  {
    phase: "floracion_t1",
    system: "coco",
    ppm: {
      "N": 150,
      "P": 85,
      "K": 240,
      "Ca": 180,
      "Mg": 65,
      "S": 75
    },
    ecMin: 1.8,
    ecMax: 2.4,
    phMin: 5.8,
    phMax: 6.3
  },
  {
    phase: "floracion_t2",
    system: "coco",
    ppm: {
      "N": 110,
      "P": 110,
      "K": 280,
      "Ca": 190,
      "Mg": 70,
      "S": 80
    },
    ecMin: 2.0,
    ecMax: 2.6,
    phMin: 5.8,
    phMax: 6.3
  },
  {
    phase: "floracion_t3",
    system: "coco",
    ppm: {
      "N": 70,
      "P": 85,
      "K": 260,
      "Ca": 180,
      "Mg": 65,
      "S": 75
    },
    ecMin: 1.8,
    ecMax: 2.2,
    phMin: 5.8,
    phMax: 6.3
  },
  {
    phase: "flush",
    system: "coco",
    ppm: {
      "N": 0,
      "P": 0,
      "K": 0,
      "Ca": 0,
      "Mg": 0,
      "S": 0
    },
    ecMin: 0.0,
    ecMax: 0.4,
    phMin: 6.0,
    phMax: 6.5
  }
];

export const ALL_TARGETS = [...TARGETS_HIDROPONIA, ...TARGETS_COCO];

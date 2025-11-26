import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportToPNG(elementId: string, fileName: string = "receta.png"): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error("Elemento no encontrado");
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: "#ffffff",
    logging: false
  });

  canvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    }
  });
}

export async function exportToPDF(elementId: string, fileName: string = "receta.pdf"): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error("Elemento no encontrado");
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: "#ffffff",
    logging: false
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? "landscape" : "portrait",
    unit: "mm"
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  const imgX = (pdfWidth - imgWidth * ratio) / 2;
  const imgY = 10;

  pdf.addImage(
    imgData,
    "PNG",
    imgX,
    imgY,
    imgWidth * ratio,
    imgHeight * ratio
  );

  pdf.save(fileName);
}

export function shareAsText(content: string): void {
  if (navigator.share) {
    navigator.share({
      title: "Dr. Cannabis - Receta",
      text: content
    }).catch(() => {
      // Fallback: copiar al portapapeles
      copyToClipboard(content);
    });
  } else {
    copyToClipboard(content);
  }
}

function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text);
}

export function exportToCSV(data: any[], fileName: string = "export.csv"): void {
  if (data.length === 0) {
    throw new Error("No hay datos para exportar");
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(","),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values that contain commas or quotes
        if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? "";
      }).join(",")
    )
  ].join("\n");

  const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

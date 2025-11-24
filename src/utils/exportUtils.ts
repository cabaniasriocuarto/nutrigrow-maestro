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

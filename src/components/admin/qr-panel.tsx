"use client";

import { QRCodeCanvas } from "qrcode.react";
import { Download } from "lucide-react";
import { Button } from "../ui/button";

export function QrPanel({ url }: { url: string }) {
  function download() {
    const canvas = document.getElementById("menu-qr") as HTMLCanvasElement | null;
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "menu-qr.png";
    link.click();
  }

  return (
    <div className="grid max-w-xl gap-5 rounded-3xl border border-border bg-white p-6 text-center soft-shadow">
      <div className="mx-auto rounded-3xl bg-white p-4 shadow-inner">
        <QRCodeCanvas id="menu-qr" value={url} size={260} level="H" includeMargin />
      </div>
      <p className="text-xl font-black">Escanea para ver el menu y realizar tu pedido.</p>
      <p className="text-sm text-muted-foreground">{url}</p>
      <Button onClick={download}><Download size={18} /> Descargar QR</Button>
    </div>
  );
}

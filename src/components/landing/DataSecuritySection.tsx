import React from 'react';
import {
  Lock,
  QrCode,
  Key,
  ArrowRight,
  Smartphone,
} from 'lucide-react';

export const DataSecuritySection: React.FC = () => {
  return (
    <section id="security" className="py-20 sm:py-28 px-4 sm:px-8 max-w-[1200px] mx-auto bg-[#FCFAF7]">
      {/* Numbered Section Label Pattern */}
      <div className="flex items-center gap-2.5 mb-4">
        <span className="px-2 py-0.5 rounded bg-[#FE6E00]/15 text-[#FE6E00] font-mono text-xs font-bold border border-[#FE6E00]/30">
          03
        </span>
        <span className="text-xs font-mono tracking-widest text-[#797067] uppercase font-bold">
          SECURITY & ENCRYPTION
        </span>
      </div>

      {/* Split Header: Headline Left, Supporting Paragraph Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-baseline mb-14">
        <div className="lg:col-span-6">
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-[#423D38] leading-[1.15]">
            End-to-end encrypted.
          </h2>
        </div>
        <div className="lg:col-span-6">
          <p className="text-base sm:text-lg text-[#797067] leading-relaxed">
            Engineered for high-threat, disrupted environments. Every satellite telemetry
            packet, triage classification, and dispatch order is cryptographically signed
            at origin and transmitted as ciphertext over tactical mesh radio.
          </p>
        </div>
      </div>

      {/* Two Equal Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card 1: Cryptographic Encryption Pipeline */}
        <div className="rounded-2xl bg-white border border-[#E3E0DD] p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm">
          <div className="space-y-1.5">
            <span className="text-xs font-mono uppercase text-[#FE6E00] font-bold">
              Pipeline Verification
            </span>
            <h3 className="text-xl font-bold text-[#423D38] tracking-tight">
              Deterministic Ingestion & Local Ciphertext
            </h3>
            <p className="text-sm text-[#797067]">
              Raw orbital downlinks are verified through local cryptographic checksums before entering the triage pipeline.
            </p>
          </div>

          {/* Diagram 1 Built from UI Chips & Hairlines */}
          <div className="p-5 rounded-xl bg-[#F3F4F6] border border-[#E3E0DD] space-y-4">
            {/* Step 1: Input Data Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-white border border-[#E3E0DD] text-[11px] font-mono text-[#423D38] font-medium shadow-xs">
                SAR Pass 14B
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white border border-[#E3E0DD] text-[11px] font-mono text-[#423D38] font-medium shadow-xs">
                OSM Vectors
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white border border-[#E3E0DD] text-[11px] font-mono text-[#423D38] font-medium shadow-xs">
                SRTM 30m DEM
              </span>
            </div>

            {/* Hairline Connector Down */}
            <div className="flex items-center gap-2 pl-4">
              <div className="w-[1px] h-6 bg-[#D1D5DC]" />
              <span className="text-[10px] font-mono text-[#797067]">
                SHA-256 Digest Verification
              </span>
            </div>

            {/* Step 2: Padlock Chip */}
            <div className="p-3 rounded-xl bg-white border border-[#E3E0DD] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#FE6E00]/15 text-[#FE6E00] flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#423D38]">Ed25519 Local Verification</div>
                  <div className="text-[10px] font-mono text-[#797067]">Zero-Cloud Ingestion</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#016630] text-[10px] font-mono font-bold">
                VERIFIED
              </span>
            </div>

            {/* Hairline Connector Down */}
            <div className="flex items-center gap-2 pl-4">
              <div className="w-[1px] h-6 bg-[#D1D5DC]" />
              <span className="text-[10px] font-mono text-[#FE6E00] font-bold">
                Tactical Mesh Radio Envelope
              </span>
            </div>

            {/* Step 3: Ciphertext & Target Device */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E3E0DD] shadow-xs">
              <div className="flex items-center gap-2 font-mono text-xs text-[#423D38]">
                <span className="text-[#797067] text-[10px]">CIPHERTEXT:</span>
                <span className="text-[#FE6E00] text-[11px] font-bold truncate max-w-[140px] sm:max-w-[190px]">
                  0x8f2a93c7...b10e47
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#423D38]">
                <Smartphone className="w-3.5 h-3.5 text-[#FE6E00]" />
                <span className="font-semibold">Field Device</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: QR Pairing & Active Device Roster */}
        <div className="rounded-2xl bg-white border border-[#E3E0DD] p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm">
          <div className="space-y-1.5">
            <span className="text-xs font-mono uppercase text-[#FE6E00] font-bold">
              Tactical Mesh Pairing
            </span>
            <h3 className="text-xl font-bold text-[#423D38] tracking-tight">
              Mutual Air-Gap Node Authorization
            </h3>
            <p className="text-sm text-[#797067]">
              Devices join emergency coordination channels via optical QR exchange, with immediate cryptographic revocation of severed nodes.
            </p>
          </div>

          {/* Diagram 2 Built from UI Chips & Hairlines */}
          <div className="p-5 rounded-xl bg-[#F3F4F6] border border-[#E3E0DD] space-y-4">
            {/* Header: QR Code & Key Chips */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#E3E0DD] shadow-xs">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#423D38]" />
                <span className="text-xs font-mono font-semibold text-[#423D38]">Optical PSK Handshake</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#FE6E00] font-bold">
                <Key className="w-3 h-3" />
                <span>ChaCha20-Poly1305</span>
              </div>
            </div>

            {/* Hairline Divider */}
            <div className="h-[1px] bg-[#E3E0DD]" />

            {/* Active Device Status List */}
            <div className="space-y-2">
              {/* Device 1: EOC Kathmandu */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-[#E3E0DD] text-xs font-mono shadow-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#00C758]" />
                  <span className="text-[#423D38] font-bold">Kathmandu Central EOC</span>
                </div>
                <span className="text-[10px] text-[#797067]">Primary Hub · 0.4ms</span>
              </div>

              {/* Device 2: Field Scout Alpha */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-[#E3E0DD] text-xs font-mono shadow-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#00C758]" />
                  <span className="text-[#423D38]">Rasuwa Field Scout Alpha</span>
                </div>
                <span className="text-[10px] text-[#016630] font-bold">Online · BLE Mesh</span>
              </div>

              {/* Device 3: Drone Recon Unit */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-[#E3E0DD] text-xs font-mono shadow-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#00C758]" />
                  <span className="text-[#423D38]">Trishuli Recon Drone 03</span>
                </div>
                <span className="text-[10px] text-[#016630] font-bold">Online · 915 MHz</span>
              </div>

              {/* Device 4: Removed / Revoked Node */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-[#E3E0DD] text-xs font-mono opacity-60">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#FB2C36]" />
                  <span className="text-[#797067] line-through">Field Terminal Echo</span>
                </div>
                <span className="text-[10px] text-[#FB2C36] font-bold">Revoked · Lost Contact</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fine Print & Detail Link */}
      <div className="mt-10 pt-6 border-t border-[#E3E0DD] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 text-xs font-mono text-[#FE6E00]">
          <p className="font-semibold">
            Deterministic local processing ensures zero unencrypted disaster coordinates or responder locations transit commercial cloud brokers.
          </p>
          <p className="text-[#797067]">
            Compliant with ISO/IEC 27001 disaster continuity frameworks and IASC humanitarian data policies.
          </p>
        </div>

        <a
          href="#faq"
          className="text-xs font-mono font-bold text-[#FE6E00] hover:text-[#FF6B00] transition-colors flex items-center gap-1.5 shrink-0 group whitespace-nowrap"
        >
          <span>Read cryptographic specification</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </section>
  );
};

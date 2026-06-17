"""
DefiLlama API — MegaETH & USDM data fetcher
============================================
Instalar dependencias:
    pip install requests pandas tabulate

Uso:
    python defillama_megaeth.py
    python defillama_megaeth.py --days 30
    python defillama_megaeth.py --export          # guarda CSVs
    python defillama_megaeth.py --all             # todos los endpoints
"""

import requests
import argparse
import json
import sys
from datetime import datetime, timezone
from typing import Optional

# ── Base URLs (free API, sin auth) ─────────────────────────────────────────
TVL_BASE        = "https://api.llama.fi"
STABLES_BASE    = "https://stablecoins.llama.fi"
YIELDS_BASE     = "https://yields.llama.fi"
COINS_BASE      = "https://coins.llama.fi"

HEADERS = {
    "Accept": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
}

# ── Helpers ─────────────────────────────────────────────────────────────────

def get(url: str, params: dict = None) -> dict | list:
    r = requests.get(url, headers=HEADERS, params=params, timeout=20)
    r.raise_for_status()
    return r.json()

def fmt_usd(n: float) -> str:
    if n >= 1e9:  return f"${n/1e9:.3f}B"
    if n >= 1e6:  return f"${n/1e6:.2f}M"
    if n >= 1e3:  return f"${n/1e3:.1f}K"
    return f"${n:.2f}"

def ts_to_date(ts: int) -> str:
    return datetime.fromtimestamp(ts, tz=timezone.utc).strftime("%Y-%m-%d")

def print_section(title: str):
    print(f"\n{'─'*60}")
    print(f"  {title}")
    print(f"{'─'*60}")

# ── 1. Chain TVL ─────────────────────────────────────────────────────────────

def chain_tvl(days: int = 90, export: bool = False):
    print_section("MegaETH — Chain TVL histórico")
    data = get(f"{TVL_BASE}/v2/historicalChainTvl/MegaETH")

    if not data:
        print("Sin datos.")
        return

    recent = data[-days:]
    current = recent[-1]
    prev_7d = recent[-8] if len(recent) >= 8 else recent[0]
    prev_30d = recent[-31] if len(recent) >= 31 else recent[0]

    print(f"\nTVL actual:    {fmt_usd(current['tvl'])}")
    print(f"Cambio 7d:     {((current['tvl']/prev_7d['tvl'])-1)*100:+.1f}%")
    print(f"Cambio 30d:    {((current['tvl']/prev_30d['tvl'])-1)*100:+.1f}%")
    print(f"Fecha:         {ts_to_date(current['date'])}")

    print(f"\nÚltimos 14 días:")
    print(f"{'Fecha':<12} {'TVL':>14}")
    print(f"{'─'*12} {'─'*14}")
    for d in recent[-14:]:
        print(f"{ts_to_date(d['date']):<12} {fmt_usd(d['tvl']):>14}")

    if export:
        import csv
        with open("megaeth_tvl.csv", "w", newline="") as f:
            w = csv.writer(f)
            w.writerow(["date", "tvl_usd"])
            for d in data:
                w.writerow([ts_to_date(d["date"]), d["tvl"]])
        print("\n→ Exportado: megaeth_tvl.csv")

    return data

# ── 2. USDM (MegaUSD) stablecoin ─────────────────────────────────────────────

def usdm_data(days: int = 90, export: bool = False):
    print_section("USDM (MegaUSD) — Supply & distribución")

    all_stables = get(f"{STABLES_BASE}/stablecoins")
    pegged = all_stables.get("peggedAssets", [])

    usdm = None
    for p in pegged:
        name = p.get("name", "").lower()
        symbol = p.get("symbol", "").lower()
        if "megausd" in name or ("usdm" in symbol and "mega" in name):
            usdm = p
            break

    if not usdm:
        for p in pegged:
            if "mega" in p.get("name", "").lower():
                usdm = p
                break

    if not usdm:
        print("No se encontró MegaUSD en la lista de stablecoins.")
        print("Stablecoins que contienen 'mega' o 'usdm':")
        for p in pegged:
            n = p.get("name", "").lower()
            s = p.get("symbol", "").lower()
            if "mega" in n or "usdm" in s:
                print(f"  id={p.get('id')} name={p.get('name')} symbol={p.get('symbol')}")
        return

    asset_id = usdm["id"]
    print(f"\nAsset encontrado: {usdm['name']} (ID: {asset_id})")

    detail = get(f"{STABLES_BASE}/stablecoin/{asset_id}")

    circ_history = detail.get("chainBalances", {})
    tokens_total  = detail.get("tokens", [])

    if tokens_total:
        recent = tokens_total[-days:]
        def entry_supply(entry):
            return entry.get("circulating", {}).get("peggedUSD", 0)

        current_entry = recent[-1]
        current_supply = entry_supply(current_entry)

        prev_7d_entry  = recent[-8] if len(recent) >= 8 else recent[0]
        prev_7d_supply = entry_supply(prev_7d_entry)

        prev_30d_entry  = recent[-31] if len(recent) >= 31 else recent[0]
        prev_30d_supply = entry_supply(prev_30d_entry)

        print(f"\nSupply actual:  {fmt_usd(current_supply)}")
        print(f"Cambio 7d:      {((current_supply/prev_7d_supply)-1)*100:+.1f}%" if prev_7d_supply else "N/A")
        print(f"Cambio 30d:     {((current_supply/prev_30d_supply)-1)*100:+.1f}%" if prev_30d_supply else "N/A")
        print(f"Fecha:          {ts_to_date(current_entry['date'])}")

        kpi_target = 500_000_000
        pct = current_supply / kpi_target * 100
        bar_filled = int(pct / 5)
        bar = "█" * bar_filled + "░" * (20 - bar_filled)
        print(f"\nKPI-1 progreso: [{bar}] {pct:.1f}% de {fmt_usd(kpi_target)}")

        print(f"\n{'─'*40}")
        print("  Revenue estimado para buybacks MEGA")
        print(f"{'─'*40}")
        for yield_pct in [3.5, 3.75, 4.0, 4.5]:
            annual = current_supply * yield_pct / 100
            daily  = annual / 365
            print(f"  Yield {yield_pct:.2f}%  →  {fmt_usd(annual)}/año  ({fmt_usd(daily)}/día)")

        print(f"\nÚltimos 14 días (supply total):")
        print(f"{'Fecha':<12} {'Supply':>14}")
        print(f"{'─'*12} {'─'*14}")
        for entry in recent[-14:]:
            supply = entry_supply(entry)
            print(f"{ts_to_date(entry['date']):<12} {fmt_usd(supply):>14}")

        if export:
            import csv
            with open("usdm_supply.csv", "w", newline="") as f:
                w = csv.writer(f)
                w.writerow(["date", "supply_usd"])
                for entry in tokens_total:
                    supply = entry_supply(entry)
                    w.writerow([ts_to_date(entry["date"]), supply])
            print("\n→ Exportado: usdm_supply.csv")

    print(f"\nDistribución por chain (actual):")
    current_chains = detail.get("currentChainBalances", {})
    if current_chains:
        print(f"{'Chain':<20} {'Supply':>14}")
        print(f"{'─'*20} {'─'*14}")
        for chain, val in sorted(current_chains.items(), key=lambda x: -(x[1].get("peggedUSD", 0) if isinstance(x[1], dict) else x[1])):
            amount = val.get("peggedUSD", 0) if isinstance(val, dict) else val
            print(f"{chain:<20} {fmt_usd(amount):>14}")

    return detail

# ── 3. Stablecoins en MegaETH chain ──────────────────────────────────────────

def stablecoins_on_chain():
    print_section("Stablecoins en MegaETH — market cap actual")
    data = get(f"{STABLES_BASE}/stablecoinchains")

    mega = None
    for c in data:
        if c.get("name", "").lower() == "megaeth":
            mega = c
            break

    if not mega:
        print("MegaETH no encontrado en /stablecoinchains")
        print("Chains disponibles con 'mega':")
        for c in data:
            if "mega" in c.get("name", "").lower():
                print(f"  {c}")
        return

    print(f"\nTotal stablecoin mcap en MegaETH: {fmt_usd(mega.get('totalCirculatingUSD', {}).get('peggedUSD', 0))}")
    print(json.dumps(mega, indent=2))

# ── 4. Protocols en MegaETH ──────────────────────────────────────────────────

def protocols_on_megaeth(export: bool = False):
    print_section("Protocolos en MegaETH — TVL breakdown")
    all_protocols = get(f"{TVL_BASE}/protocols")

    mega_protocols = [
        p for p in all_protocols
        if "megaeth" in str(p.get("chains", [])).lower()
        or "megaeth" in str(p.get("chain", "")).lower()
    ]

    if not mega_protocols:
        print("No se encontraron protocolos con chain=MegaETH")
        return

    mega_protocols.sort(key=lambda p: p.get("tvl", 0), reverse=True)

    print(f"\n{'Protocolo':<28} {'TVL':>12} {'Categoría':<20} {'Change 7d':>10}")
    print(f"{'─'*28} {'─'*12} {'─'*20} {'─'*10}")
    for p in mega_protocols:
        name     = p.get("name", "?")[:27]
        tvl      = p.get("tvl", 0)
        cat      = p.get("category", "?")[:19]
        ch7d     = p.get("change_7d", None)
        ch_str   = f"{ch7d:+.1f}%" if ch7d is not None else "—"
        print(f"{name:<28} {fmt_usd(tvl):>12} {cat:<20} {ch_str:>10}")

    if export:
        import csv
        with open("megaeth_protocols.csv", "w", newline="") as f:
            w = csv.writer(f)
            w.writerow(["name", "tvl", "category", "change_7d", "chains"])
            for p in mega_protocols:
                w.writerow([
                    p.get("name"), p.get("tvl"), p.get("category"),
                    p.get("change_7d"), ";".join(p.get("chains", []))
                ])
        print(f"\n→ Exportado: megaeth_protocols.csv ({len(mega_protocols)} protocolos)")

    return mega_protocols

# ── 5. Fees & revenue en MegaETH ─────────────────────────────────────────────

def fees_on_megaeth():
    print_section("Fees & Revenue en MegaETH")
    data = get(f"{TVL_BASE}/overview/fees/MegaETH", params={"excludeTotalDataChart": "true"})

    protocols = data.get("protocols", [])
    if not protocols:
        print("Sin datos de fees para MegaETH.")
        return

    protocols.sort(key=lambda p: p.get("total24h", 0) or 0, reverse=True)

    print(f"\n{'Protocolo':<28} {'Fees 24h':>12} {'Fees 7d':>12} {'Rev 24h':>12}")
    print(f"{'─'*28} {'─'*12} {'─'*12} {'─'*12}")
    for p in protocols[:20]:
        name    = p.get("name", "?")[:27]
        f24h    = p.get("total24h") or 0
        f7d     = p.get("total7d") or 0
        r24h    = p.get("totalRevenue24h") or 0
        print(f"{name:<28} {fmt_usd(f24h):>12} {fmt_usd(f7d):>12} {fmt_usd(r24h):>12}")

    print(f"\nChain total (si disponible):")
    for k in ["total24h", "total7d", "total30d"]:
        v = data.get(k)
        if v:
            label = k.replace("total", "")
            print(f"  Fees {label}: {fmt_usd(v)}")

# ── 6. DEX volumes en MegaETH ────────────────────────────────────────────────

def dex_volumes_megaeth():
    print_section("DEX Volumes en MegaETH")
    data = get(f"{TVL_BASE}/overview/dexs/MegaETH", params={"excludeTotalDataChart": "true"})

    protocols = data.get("protocols", [])
    if not protocols:
        print("Sin datos de DEX para MegaETH.")
        return

    protocols.sort(key=lambda p: p.get("total24h", 0) or 0, reverse=True)

    print(f"\n{'DEX':<28} {'Vol 24h':>14} {'Vol 7d':>14} {'Vol 30d':>14}")
    print(f"{'─'*28} {'─'*14} {'─'*14} {'─'*14}")
    for p in protocols[:15]:
        name  = p.get("name", "?")[:27]
        v24h  = p.get("total24h") or 0
        v7d   = p.get("total7d") or 0
        v30d  = p.get("total30d") or 0
        print(f"{name:<28} {fmt_usd(v24h):>14} {fmt_usd(v7d):>14} {fmt_usd(v30d):>14}")

    total24h = data.get("total24h")
    if total24h:
        print(f"\nTotal DEX volume 24h en MegaETH: {fmt_usd(total24h)}")

# ── Markdown export ──────────────────────────────────────────────────────────

def generate_md(days: int = 90) -> str:
    lines = []
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    lines.append(f"# MegaETH — DefiLlama Dashboard")
    lines.append(f"\n> Generado: {now}\n")

    # TVL
    lines.append("## Chain TVL")
    tvl_data = get(f"{TVL_BASE}/v2/historicalChainTvl/MegaETH")
    if tvl_data:
        recent = tvl_data[-days:]
        cur = recent[-1]
        p7  = recent[-8]  if len(recent) >= 8  else recent[0]
        p30 = recent[-31] if len(recent) >= 31 else recent[0]
        lines.append(f"\n| Métrica | Valor |")
        lines.append(f"|---------|-------|")
        lines.append(f"| TVL actual | **{fmt_usd(cur['tvl'])}** |")
        lines.append(f"| Cambio 7d | {((cur['tvl']/p7['tvl'])-1)*100:+.1f}% |")
        lines.append(f"| Cambio 30d | {((cur['tvl']/p30['tvl'])-1)*100:+.1f}% |")
        lines.append(f"| Fecha | {ts_to_date(cur['date'])} |")
        lines.append(f"\n### Últimos 14 días\n")
        lines.append("| Fecha | TVL |")
        lines.append("|-------|-----|")
        for d in recent[-14:]:
            lines.append(f"| {ts_to_date(d['date'])} | {fmt_usd(d['tvl'])} |")

    # USDM
    lines.append("\n## USDM (MegaUSD) — Supply")
    all_stables = get(f"{STABLES_BASE}/stablecoins")
    usdm = None
    for p in all_stables.get("peggedAssets", []):
        if "megausd" in p.get("name","").lower() or ("usdm" in p.get("symbol","").lower() and "mega" in p.get("name","").lower()):
            usdm = p; break
    if not usdm:
        for p in all_stables.get("peggedAssets", []):
            if "mega" in p.get("name","").lower():
                usdm = p; break

    if usdm:
        detail = get(f"{STABLES_BASE}/stablecoin/{usdm['id']}")
        tokens_total = detail.get("tokens", [])
        def entry_supply(e): return e.get("circulating", {}).get("peggedUSD", 0)
        if tokens_total:
            recent = tokens_total[-days:]
            cur_s   = entry_supply(recent[-1])
            p7_s    = entry_supply(recent[-8]  if len(recent) >= 8  else recent[0])
            p30_s   = entry_supply(recent[-31] if len(recent) >= 31 else recent[0])
            kpi = 500_000_000
            pct = cur_s / kpi * 100
            bar = "█" * int(pct/5) + "░" * (20 - int(pct/5))
            lines.append(f"\n| Métrica | Valor |")
            lines.append(f"|---------|-------|")
            lines.append(f"| Supply actual | **{fmt_usd(cur_s)}** |")
            lines.append(f"| Cambio 7d | {((cur_s/p7_s)-1)*100:+.1f}% |" if p7_s else "| Cambio 7d | N/A |")
            lines.append(f"| Cambio 30d | {((cur_s/p30_s)-1)*100:+.1f}% |" if p30_s else "| Cambio 30d | N/A |")
            lines.append(f"| KPI-1 progreso | [{bar}] {pct:.1f}% de {fmt_usd(kpi)} |")

            lines.append(f"\n### Revenue estimado para buybacks MEGA\n")
            lines.append("| Yield | Anual | Diario |")
            lines.append("|-------|-------|--------|")
            for y in [3.5, 3.75, 4.0, 4.5]:
                lines.append(f"| {y:.2f}% | {fmt_usd(cur_s*y/100)} | {fmt_usd(cur_s*y/100/365)} |")

            lines.append(f"\n### Supply últimos 14 días\n")
            lines.append("| Fecha | Supply |")
            lines.append("|-------|--------|")
            for e in recent[-14:]:
                lines.append(f"| {ts_to_date(e['date'])} | {fmt_usd(entry_supply(e))} |")

        current_chains = detail.get("currentChainBalances", {})
        if current_chains:
            lines.append(f"\n### Distribución por chain\n")
            lines.append("| Chain | Supply |")
            lines.append("|-------|--------|")
            for chain, val in sorted(current_chains.items(), key=lambda x: -(x[1].get("peggedUSD",0) if isinstance(x[1],dict) else x[1])):
                amount = val.get("peggedUSD",0) if isinstance(val,dict) else val
                lines.append(f"| {chain} | {fmt_usd(amount)} |")

    # Protocols
    lines.append("\n## Protocolos en MegaETH\n")
    all_protocols = get(f"{TVL_BASE}/protocols")
    mega_protocols = [p for p in all_protocols if "megaeth" in str(p.get("chains",[])).lower() or "megaeth" in str(p.get("chain","")).lower()]
    mega_protocols.sort(key=lambda p: p.get("tvl",0), reverse=True)
    lines.append("| Protocolo | TVL | Categoría | Change 7d |")
    lines.append("|-----------|-----|-----------|-----------|")
    for p in mega_protocols:
        ch7d = p.get("change_7d")
        ch_str = f"{ch7d:+.1f}%" if ch7d is not None else "—"
        lines.append(f"| {p.get('name','?')} | {fmt_usd(p.get('tvl',0))} | {p.get('category','?')} | {ch_str} |")

    # Fees
    lines.append("\n## Fees & Revenue en MegaETH\n")
    fees_data = get(f"{TVL_BASE}/overview/fees/MegaETH", params={"excludeTotalDataChart": "true"})
    protocols_fees = sorted(fees_data.get("protocols", []), key=lambda p: p.get("total24h",0) or 0, reverse=True)
    lines.append("| Protocolo | Fees 24h | Fees 7d | Rev 24h |")
    lines.append("|-----------|----------|---------|---------|")
    for p in protocols_fees[:20]:
        lines.append(f"| {p.get('name','?')} | {fmt_usd(p.get('total24h') or 0)} | {fmt_usd(p.get('total7d') or 0)} | {fmt_usd(p.get('totalRevenue24h') or 0)} |")
    for k in ["total24h","total7d","total30d"]:
        v = fees_data.get(k)
        if v: lines.append(f"\n**Fees {k.replace('total','')}:** {fmt_usd(v)}")

    # DEX
    lines.append("\n## DEX Volumes en MegaETH\n")
    dex_data = get(f"{TVL_BASE}/overview/dexs/MegaETH", params={"excludeTotalDataChart": "true"})
    protocols_dex = sorted(dex_data.get("protocols", []), key=lambda p: p.get("total24h",0) or 0, reverse=True)
    lines.append("| DEX | Vol 24h | Vol 7d | Vol 30d |")
    lines.append("|-----|---------|--------|---------|")
    for p in protocols_dex[:15]:
        lines.append(f"| {p.get('name','?')} | {fmt_usd(p.get('total24h') or 0)} | {fmt_usd(p.get('total7d') or 0)} | {fmt_usd(p.get('total30d') or 0)} |")
    if dex_data.get("total24h"):
        lines.append(f"\n**Total DEX volume 24h:** {fmt_usd(dex_data['total24h'])}")

    return "\n".join(lines)

# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="DefiLlama API — MegaETH & USDM")
    parser.add_argument("--days",   type=int,  default=90,    help="Días de histórico (default: 90)")
    parser.add_argument("--export", action="store_true",      help="Exportar datos a CSV")
    parser.add_argument("--md",     action="store_true",      help="Exportar reporte a Markdown")
    parser.add_argument("--all",    action="store_true",      help="Todos los endpoints")
    parser.add_argument(
        "--section",
        choices=["tvl", "usdm", "stables", "protocols", "fees", "dex"],
        help="Correr solo una sección específica"
    )
    args = parser.parse_args()

    if args.md:
        print("Generando reporte markdown...")
        md = generate_md(days=args.days)
        filename = f"megaeth_report_{datetime.now().strftime('%Y%m%d_%H%M')}.md"
        with open(filename, "w") as f:
            f.write(md)
        print(f"→ Exportado: {filename}")
        return

    print("=" * 60)
    print("  DefiLlama API — MegaETH Dashboard")
    print(f"  {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    try:
        if args.section == "tvl" or args.all or not args.section:
            chain_tvl(days=args.days, export=args.export)

        if args.section == "usdm" or args.all or not args.section:
            usdm_data(days=args.days, export=args.export)

        if args.section == "stables" or args.all:
            stablecoins_on_chain()

        if args.section == "protocols" or args.all or not args.section:
            protocols_on_megaeth(export=args.export)

        if args.section == "fees" or args.all or not args.section:
            fees_on_megaeth()

        if args.section == "dex" or args.all or not args.section:
            dex_volumes_megaeth()

    except requests.HTTPError as e:
        print(f"\n[ERROR HTTP] {e}")
        print(f"URL: {e.response.url}")
        print(f"Response: {e.response.text[:500]}")
        sys.exit(1)
    except requests.ConnectionError as e:
        print(f"\n[ERROR] No se pudo conectar a la API: {e}")
        sys.exit(1)

    print("\n" + "=" * 60)
    print("  Listo.")
    print("=" * 60)

if __name__ == "__main__":
    main()

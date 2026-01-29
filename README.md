# 2.Erronka — TicketBAI (Web + Programa)

**2.Erronka** proiektuaren biltegia. Proiektu honek bi atal nagusi ditu:
- **Web aplikazioa (HTML/CSS/JS)**: ticketak karpeta batetik irakurri eta web interfazearen bidez ikusteko.
- **Kontsola programa (C#)**: ticketak prozesatu, XML sortu/balidatu, backup egin eta MySQL datu-basearekin lan egiteko (fitxategi konprimitu batean).

---

## Biltegiaren edukia
- `index.html` → Web aplikazioaren sarrera
- `XML/` → XML fitxategiak / baliabideak
- `DATU BASE/` → datu-baseari lotutako fitxategiak (scriptak, dokumentazioa, etab.)
- `BackUp/` → segurtasun kopiak (ticketak / XML-ak)
- `2.Erronka.zip` → **kontsola programa (C#) konprimatua**
- `erregistroa.xlsx` → bidalketen/erregistroen Excel fitxategia
- `TXOSTEN TEKNIKOA (3).pdf` → txosten teknikoa
- Beste `.pdf` fitxategiak → laguntza/dokumentazioa

---

## Web aplikazioa

### Helburua
Erabiltzaileak ticketak gordetzen diren **karpeta bat aukeratzen du** eta aplikazioak:
- ticketen zerrenda automatikoki erakusten du,
- bilaketa eta ordenazioa eskaintzen du,
- eta ticket bat aukeratzean edukia osorik bistaratzen du.

### Funtzionalitateak
- Hasierako pantaila: **Sartu**
- Karpeta aukeraketa
- Ticket zerrenda + aurrebista laburra
- Bilaketa (izena/edukia)
- Ordenazioa
- Xehetasun panela (eduki osoa)
- Kopiatu (clipboard) eta Deskargatu (.txt)

### Nola exekutatu (Web)
1. Ireki proiektua **VS Code**-n.
2. Abiarazi **Live Server** `index.html`-ekin.
3. Nabigatzailean, sakatu **Sartu** eta aukeratu ticketak dituen karpeta.

**Oharra:** gomendatutako nabigatzailea **Chrome/Edge** da (`showDirectoryPicker()` API-aren murrizketengatik).

---

## Kontsola programa (C#) — `2.Erronka.zip`

### Zer egiten du?
Kontsola programak TicketBAI testuinguruan ticketak prozesatzeko pausu nagusiak egiten ditu:
- Ticketak irakurri (`.txt`)
- Datuak parseatu eta objektu bihurtu
- XML sortu eta XSD bidez balidatu
- (Aukerazkoa) saltzailea aldatu
- Datuak **MySQL** datu-basean gorde
- Backup eta erregistroak sortu

### Menua (erabilera)
- **1. Prozesatu**: ticketak irakurri → XML sortu/balidatu → backup/DB…
- **2. Estadistikak ikusi**: datu-baseko datuekin estatistikak erakutsi
- **3. Datu basean dagoen saltzailea aldatu**: ticket baten saltzailea DB-n eguneratu (UPDATE)
- **4. Atera**: programatik irten

**Oharra:** programak sarritan **ENTER** eskatzen du jarraitzeko (pausoz pauso kontrola).

### Nola exekutatu (C#)
1. Deskargatu `2.Erronka.zip` eta **deskonprimitu**.
2. Ireki proiektua **Visual Studio**-n (gomendatua).
3. Egiaztatu/konfiguratu:
   - `.NET` bertsioa (adib. `net8.0`)
   - MySQL konexioa (`connectionString`)
   - (Beharrezkoa bada) Outlook konfigurazioa XML bidalketarako
4. Build/Run egin.

---

## Baldintzak eta mugak

### Web
- Chrome/Edge gomendatua
- VS Code + Live Server

### Kontsola (C#)
- Windows
- Visual Studio + .NET
- MySQL/MariaDB (Workbench gomendatua)
- (Aukerazkoa) Outlook (XML bidalketarako)

---

## Egileak
- Aimar Mayo
- Andoni Nuñez
- Hurritz Ostolaza

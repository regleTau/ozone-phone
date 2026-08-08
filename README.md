# OZONE Phone - FiveM

> ⚠️ Telefonul este inca in lucru (WIP) — unele functii pot lipsi.

---

## Preview

| Setup | SIM | Hello |
|:---:|:---:|:---:|
| ![](docs/screenshots/preview3_setup.png) | ![](docs/screenshots/preview2_sim.png) | ![](docs/screenshots/preview1_hello.png) |

---

## Ce are

- Boot screen cu logo Apple la pornire
- Setup wizard ca pe iPhone real (Hello, SIM, wallpaper)
- Control Center cu slider luminozitate si volum
- Tastatura telefon cu litere sub cifre ca pe iPhone
- iMessage cu thread-uri si cautare
- YouTube cu player si cautare live
- Spotify cu album art si controale
- Maze Bank cu sold si transfer
- Garaj cu vehicule si GPS
- Dynamic Island cu mini player muzica

---

## Ce urmeaza

- Camera NUI live — in lucru
- SMS intre jucatori — in lucru
- Contacte — in lucru
- Notificari lock screen — in lucru
- FaceTime — planificat

---

## Instalare

**1. Importa baza de date**

Deschide phpMyAdmin, selecteaza database-ul tau si importa fisierul:
`
phone_database.sql
`

Sau ruleaza direct in SQL:
`sql
SOURCE /path/to/phone_database.sql;
`

Acest fisier creeaza 4 tabele necesare:
- `phone_contacts` — contactele jucatorilor
- `phone_messages` — SMS-uri trimise/primite
- `phone_calls` — istoricul apelurilor
- `phone_settings` — setarile telefonului (wallpaper, setup)

---

**2. Pune folderul in server**

Copiaza folderul `phone` in:
`
resources/[scripts]/phone
`

---

**3. Adauga in server.cfg**

`
ensure oxmysql
ensure phone
`

> oxmysql este necesar pentru baza de date. Descarca de pe https://github.com/overextended/oxmysql

---

**4. Porneste serverul**

`
restart phone
`

---

## Contact

- Discord: discord.gg/sponexv3

---

Facut de sponex
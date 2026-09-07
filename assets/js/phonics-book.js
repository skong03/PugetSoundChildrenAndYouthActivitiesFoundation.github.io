"use strict";

(() => {
  const friends = [
    { sound: "SH", name: "Shush", animal: "the sheep", color: "#327763", pale: "#e7f0e7", symbol: "shell", habit: "A soft, long sound, like a hush.", catchphrase: "Hush, hush, little fish!" },
    { sound: "CH", name: "Chip", animal: "the chick", color: "#a54e27", pale: "#faebd9", symbol: "train", habit: "A short sound, like a little train.", catchphrase: "Chug, chug! Let’s go!" },
    { sound: "TH", name: "Beth", animal: "the moth", color: "#7958a3", pale: "#eee7f6", symbol: "feather", habit: "Tongue at your teeth. Gently blow.", catchphrase: "Think, think! I can help!" },
    { sound: "WH", name: "Whiz", animal: "the whale", color: "#326f9a", pale: "#e4eff6", symbol: "wind", habit: "Start like whale. Lips round, then open.", catchphrase: "What? Where? Let’s look!" },
    { sound: "CK", name: "Click", animal: "the duck", color: "#926519", pale: "#f8eed1", symbol: "clock", habit: "One quick sound at the end of duck.", catchphrase: "Click, clack! I can pack!" }
  ];
  const pages = [
    { friend: 0, kind: "Meet a friend", title: "Meet Shush.", lines: ["Shush is a shy sheep.", "She has a shell pin.", "She likes to hush."], scene: "meet", alt: "Shush, a mint-green sheep with a shell pin and a striped scarf, holds a hoof to her mouth. A picnic sack sits beside the pond." },
    { friend: 0, kind: "Story time", title: "Splash!", lines: ["A gust lifts the snack sack.", "Splash! It is in the pond.", "Shush sees a fish."], scene: "splash", alt: "Wind blows the red snack sack into the pond. Shush looks surprised, and a small orange fish swims toward the sack." },
    { friend: 0, kind: "Your turn", title: "Say it with Shush.", words: ["ship", "shop", "fish", "dish"], repeats: ["I see a ship.", "I see a shop.", "I see a fish.", "I see a dish."], scene: "practice", alt: "Shush sits by the pond beside four picture cards: a ship, a shop, a fish, and a dish. The snack sack is still in the water." },
    { friend: 1, kind: "Meet a friend", title: "Meet Chip.", lines: ["Chip is a bold chick.", "He has a train cap.", "He chugs when he hops."], scene: "meet", alt: "Chip, a golden chick with an orange train cap and a little train badge, hops boldly along the pond toward Shush and the floating sack." },
    { friend: 1, kind: "Story time", title: "Chips on a chin!", lines: ["Chip hops on a log.", "The log hits the bank.", "His chips fall on his chin!"], scene: "log", alt: "Chip tries to reach the snack sack on a log. The log bumps the bank, sending potato chips onto his chin. Shush watches." },
    { friend: 1, kind: "Your turn", title: "Say it with Chip.", words: ["chip", "chick", "chin", "chop"], repeats: ["I see a chip.", "I see a chick.", "This is my chin.", "I can chop."], scene: "practice", alt: "Chip stands on the bank with picture cards showing a potato chip, a chick, a chin, and a vegetable being chopped. The sack still floats nearby." },
    { friend: 2, kind: "Meet a friend", title: "Meet Beth.", lines: ["Beth is a kind moth.", "Her thin wings flap.", "She blows on a feather."], scene: "meet", alt: "Beth, a lilac moth with thin patterned wings and a feather pin, gently blows on a feather. Chip and Shush wait beside the pond." },
    { friend: 2, kind: "Story time", title: "A thin stick.", lines: ["Beth gets a thin stick.", "The stick is too short.", "A fish tugs it. Ha, ha!"], scene: "stick", alt: "Beth reaches toward the floating sack with a thin stick. It falls short, and a cheeky fish grabs the end. Chip watches from the bank." },
    { friend: 2, kind: "Your turn", title: "Say it with Beth.", words: ["thin", "thick", "moth", "bath"], repeats: ["The stick is thin.", "The log is thick.", "I see a moth.", "I like my bath."], scene: "practice", alt: "Beth hovers beside picture cards showing a thin stick, a thick log, a moth, and a bath. The friends still need help with the sack." },
    { friend: 3, kind: "Meet a friend", title: "Meet Whiz.", lines: ["Whiz is a fun whale.", "He asks what and why.", "He blows when he thinks."], scene: "meet", alt: "Whiz, a sky-blue whale with a green explorer hat and a wind-swirl badge, pops out of the pond with a curious smile and a puff of air." },
    { friend: 3, kind: "Story time", title: "What a big puff!", lines: ["Whiz gives a big puff.", "The sack whips up.", "It lands on a duck. Plop!"], scene: "puff", alt: "Whiz blows the sack out of the pond in a big curling puff. It lands upside down on the head of a yellow duck in red boots." },
    { friend: 3, kind: "Your turn", title: "Say it with Whiz.", words: ["what", "when", "where", "whale"], repeats: ["What is it?", "When can we eat?", "Where is the sack?", "I see a whale."], scene: "practice", alt: "Whiz smiles beside picture cards for what, when, where, and whale. The yellow duck still has the snack sack on her head." },
    { friend: 4, kind: "Meet a friend", title: "Meet Click.", lines: ["Click is a quick duck.", "She has a clock pin.", "Her red boots click."], scene: "meet", alt: "Click, a yellow duck in red boots with a clock pin, lifts the silly sack off her head and taps her boots." },
    { friend: 4, kind: "Story time", title: "A snack at last!", lines: ["Click lifts the sack.", "The snacks are safe!", "The pals sit on a mat.", "The duck has a snack hat!"], scene: "picnic", alt: "All five friends share a happy picnic by the pond. Shush, Chip, Beth, Whiz, and Click sit around a checked mat. Click wears the empty sack as a silly hat." },
    { friend: 4, kind: "Your turn", title: "Say it with Click.", words: ["duck", "sock", "rock", "sack"], repeats: ["I see a duck.", "I see a sock.", "I sit on a rock.", "I pack a sack."], scene: "practice", alt: "Click celebrates beside picture cards of a duck, a sock, a rock, and a sack. All five sound friends enjoy their picnic in the background.", finish: true }
  ];
  const svgStart = (viewBox, label = "") => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'} fill="none" stroke="#374e43" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">`;
  const eyes = (x, y, gap = 28) => `<ellipse cx="${x}" cy="${y}" rx="3.1" ry="4.6" fill="#344c43" stroke="none"/><ellipse cx="${x + gap}" cy="${y}" rx="3.1" ry="4.6" fill="#344c43" stroke="none"/><path d="M${x + 8} ${y + 13}q6 7 12 0"/><ellipse cx="${x - 9}" cy="${y + 10}" rx="8" ry="4" fill="#edac95" stroke="none"/><ellipse cx="${x + gap + 9}" cy="${y + 10}" rx="8" ry="4" fill="#edac95" stroke="none"/>`;
  function symbol(type, x, y, scale = 1) {
    const shapes = {
      shell: '<path d="M-13 5C-27-6-16-24-8-17c3-12 15-12 18 0 11-6 20 13 6 22L4 12Z" fill="#f8dcac"/><path d="m-8-12 10 21M3-19 1 8m12-19L4 8" stroke="#c88c60" stroke-width="1.5"/>',
      train: '<rect x="-19" y="-9" width="33" height="18" rx="3" fill="#f9e8b8"/><path d="M-9-9v-10H5v10m9 7h7v11h-7" fill="#ec8962"/><circle cx="-11" cy="12" r="5" fill="#6b826e"/><circle cx="12" cy="12" r="5" fill="#6b826e"/>',
      feather: '<path d="M-10 17C-27-3-6-23 14-22 17-7 10 9-10 17Z" fill="#fff8df"/><path d="m-15 23 22-36M-6 10l-3-11m8 4 9-3" stroke="#a697b7" stroke-width="1.7"/>',
      wind: '<path d="M-22-7h28c17 0 13-20 3-13M-15 2h40M-20 11H1c15 0 14 19 4 15" stroke="#447d9b" stroke-width="4"/>',
      clock: '<circle r="20" fill="#fff5d1"/><path d="M0-13V0l8 5M0-17v1m17 16h-1M0 17v-1m-17-16h1"/>'
    };
    return `<g transform="translate(${x} ${y}) scale(${scale})">${shapes[type]}</g>`;
  }
  function character(id, x, y, scale = 1, pose = "") {
    let shape = "";
    if (id === 0) shape = `<path d="m-37 45-6 31h19l9-28m33-1 9 29h18l-5-36" fill="#426355"/><path d="M-43-7c-31-17-41 17-24 31-19 22 6 43 24 32 11 24 37 24 44 8 24 18 49 6 47-13 29 6 40-25 23-39 7-22-15-37-32-27-14-26-40-23-48-6-14-14-37-6-34 14Z" fill="#a9ceaf"/><ellipse cx="-43" cy="-51" rx="22" ry="12" fill="#86b89a" transform="rotate(25 -43 -51)"/><ellipse cx="45" cy="-51" rx="22" ry="12" fill="#86b89a" transform="rotate(-25 45 -51)"/><path d="M-43-56q-3-43 43-41t44 43v27q-3 35-44 35t-43-35Z" fill="#f7eed2"/><path d="M-42-65c-15-16-2-35 14-31-2-21 25-28 35-12 16-12 34 1 30 17 23 2 21 27 5 30-11-11-20-6-28-9-16 12-31 5-33-2-8 9-18 7-23 7Z" fill="#bad6b4"/>${eyes(-16, -43, 32)}<path d="M-43-5q39 16 86 0l-2 17q-38 14-80 0Z" fill="#f3c37d"/><path d="m24 14 6 24 19-5-8-24" fill="#f3c37d"/><path d="m-26 0-2 14m16-11-2 15m17-13v15m17-15 2 12" stroke="#bd7954" stroke-width="2"/>${symbol("shell", -22, 29, .57)}<path d="M37 33q19-3 8-36" stroke="#5b8c6c" stroke-width="14"/><path d="M37 33q19-3 8-36" stroke="#a9ceaf" stroke-width="10"/>`;
    if (id === 1) shape = `<path d="m-21 51-3 24m4 0h-20m-3 0 8-7m50-17 6 24m-6 0h20m3 0-8-7" stroke="#bd7244" stroke-width="6"/><path d="M-47 14c-22 13-31-6-35-16 20 5 25-9 40-14" fill="#efb650"/><path d="M-47-17q-8-39 42-41 45-1 52 39c14 38 4 76-45 76-43 0-60-27-49-74Z" fill="#f4c965"/><path d="M24 2q32 20 8 36" fill="#e9a849"/>${eyes(-19, -21, 33)}<path d="m-5-8 20 5-17 12Z" fill="#e68e49"/><path d="M-48-51v-18q47-27 89 0v18" fill="#df8660"/><path d="M-54-49q34-15 82-3l20 10q-56 7-102-7Z" fill="#c66746"/><path d="m-20-72 2 16m27-17 2 18" stroke="#f4b78d"/>${symbol("train", 7, 31, .46)}${pose === "log" ? '<path d="m-4 5 11-2 6 9-11 3Zm-22 15 11 2-4 9-11-3Z" fill="#fff0a0" stroke="#c68c3e"/>' : ""}`;
    if (id === 2) shape = `<path d="M-10-18c-30-76-82-61-71-3 3 21 17 31 37 35-40 26-25 67 13 50L0 33m10-51c30-76 82-61 71-3-3 21-17 31-37 35 40 26 25 67-13 50L0 33" fill="#c4acda"/><path d="M-27-21q-32-34-37-8m90 8q32-34 37-8M-30 34l-16 13m76-13 16 13" stroke="#eee3f2" stroke-width="9"/><circle cx="-51" cy="-15" r="8" fill="#f6d392" stroke="none"/><circle cx="51" cy="-15" r="8" fill="#f6d392" stroke="none"/><path d="m-12-57-13-23m36 23 14-23"/><circle cx="-26" cy="-83" r="5" fill="#b69bce"/><circle cx="26" cy="-83" r="5" fill="#b69bce"/><rect x="-21" y="-48" width="42" height="101" rx="22" fill="#ecdabf"/><ellipse cy="-39" rx="32" ry="30" fill="#f5e9cf"/>${eyes(-12, -43, 24)}<path d="M-18-7q19 10 36 0v14q-18 8-36 0Z" fill="#9385b7"/>${symbol("feather", 3, 24, .48)}<path d="m-10 51-6 14m26-14 6 14"/>`;
    if (id === 3) shape = `<path d="M-52 29c-37 11-62-11-64-37 18 8 25 3 31-4 1 13 14 20 31 20" fill="#88bdcc"/><path d="M-65-8c2-43 41-61 81-50 41 9 64 37 54 73-7 32-50 50-86 40-38-4-53-25-49-63Z" fill="#8ec7d7"/><path d="M-48 25q55 38 111-10c-10 51-95 63-111 10Z" fill="#e2eee0" stroke="none"/><path d="M-11 26q-10 38 22 32l13-23" fill="#70adbf"/>${eyes(5, -12, 31)}<path d="M-30-56q7-33 45-25 28 6 24 35" fill="#8fae81"/><path d="M-42-50q34 16 88 6" stroke="#64845e" stroke-width="11"/><path d="M-6-80 0-54" stroke="#c8d4a3" stroke-width="7"/>${symbol("wind", -37, 8, .37)}`;
    if (id === 4) shape = `<path d="m-21 44-6 23H-5V42m23 1 5 24h20l-9-30" fill="#eaaa44"/><path d="M-31 59h26v22h-40q-8-12 14-15Zm54 0h23l8 9q10 13-7 13H23Z" fill="#dc7c5e"/><path d="M-47-1c-28 3-29-16-37-15 10 34 19 51 42 54 9 23 65 25 82-2 22-35 6-74-22-82-36-10-59 7-65 45Z" fill="#f4d477"/><ellipse cx="4" cy="-34" rx="38" ry="35" fill="#f9df86"/>${eyes(-11, -40, 27)}<path d="m5-26 32 3q-4 17-29 12Z" fill="#e9a250"/><path d="M-18 7q-26 29 11 31" fill="#eac25f"/>${symbol("clock", 24, 21, .44)}${pose === "hat" ? '<path d="M-36-61-5-108l45 5 15 51Z" fill="#d7856a"/><path d="m-36-61 91 9m-43-52-4 41" stroke="#a45e4f"/><path d="m-23-80 62 8" stroke="#ebc4a1" stroke-width="5"/>' : ""}`;
    return `<g transform="translate(${x} ${y}) scale(${scale})">${shape}</g>`;
  }
  function sack(x, y, scale = 1, rotation = 0) {
    return `<g transform="translate(${x} ${y}) rotate(${rotation}) scale(${scale})"><path d="m-25-26-12 53q36 17 74 0L24-26Z" fill="#d9876c"/><path d="M-25-26q-4-14 7-15 16 7 36 0 10 0 6 15" fill="#e2a183"/><path d="m-23-23 46 0M-10-22l-8 36m26-36 9 36" stroke="#a86653"/><path d="m-7 3 7-6 7 6-3 9h-8Z" fill="#f6d793" stroke="none"/></g>`;
  }
  function fish(x, y, scale = 1) { return `<g transform="translate(${x} ${y}) scale(${scale})"><path d="m-20 0-17-15v30Z" fill="#eea470"/><ellipse rx="26" ry="17" fill="#efb777"/><circle cx="13" cy="-3" r="2.5" fill="#344c43" stroke="none"/><path d="m-5-3 6 6-6 4"/></g>`; }
  const flower = (x, y, color = "#ebc378", scale = 1) => `<g transform="translate(${x} ${y}) scale(${scale})" stroke-width="2"><path d="M0 0v21m0-7 8-5" stroke="#819963"/><path d="M0-4c-15-16-22 5-8 7-12 12 5 21 10 8 11 13 25-4 12-9 9-12-8-20-14-6Z" fill="${color}" stroke="none"/><circle cx="3" cy="3" r="4" fill="#f8f1ce" stroke="none"/></g>`;
  function landscape() {
    return `<rect width="560" height="470" fill="#eef2e2" stroke="none"/><circle cx="451" cy="79" r="38" fill="#f1d38a" stroke="none"/><g stroke="#d7b76b" stroke-width="2"><path d="M451 29v-8m0 116v-8m50-50h8m-116 0h8m14-36-6-6m78 78-6-6m0-66 6-6"/></g><path d="M30 109c-17 0-16-22 1-23 2-27 42-27 46-2 23-8 35 25 13 25Zm269-41c-17 0-16-20-1-20 4-19 33-18 35 0 19-5 27 21 6 20Z" fill="#fffdf1" stroke="none"/><path d="M0 270Q72 152 169 250q93-101 194-10 110-127 197 1v229H0Z" fill="#d7e3be" stroke="none"/><path d="M0 335q132-123 266-28 159-92 294-17v180H0Z" fill="#c3d7aa" stroke="none"/><path d="M373 470c-174-57-34-94-89-145-28-22-50-19-57-32 124 9 110 45 179 58 87 17 159 6 154 119Z" fill="#a8ced0" stroke="none"/><path d="M371 356h52m-28 15h38m-87 28h61m48 30h35" stroke="#e4ede0" stroke-width="3"/><g fill="#a3bb85" stroke="none"><ellipse cx="54" cy="403" rx="51" ry="18"/><ellipse cx="466" cy="315" rx="58" ry="14"/></g><g stroke="#8caa73" stroke-width="2"><path d="m38 353 4-10 5 9m64 58 5-13 5 11m365-85 4-10 5 9M53 250l4-10 4 9m120 142 5-11 4 10"/></g>${flower(58, 359, "#f0d08a", .75)}${flower(488, 348, "#dbac9c", .7)}${flower(168, 426, "#faf2d2", .8)}${flower(508, 417, "#f3cf81", .7)}<path d="M31 294q-17-47-5-89 34 33 27 79m-16-12-4-37" fill="#abc490" stroke="#91ad7b"/><path d="M519 277q-4-50 19-72 10 37-8 72" fill="#abc490" stroke="#91ad7b"/>`;
  }
  function picnic() {
    return `<path d="m153 338 214-1 46 81H110Z" fill="#f3e3c3"/><g stroke="#d29679" stroke-width="3" opacity=".5"><path d="m164 338-23 80m60-80-13 80m48-80-3 80m38-80 7 80m28-80 17 80m18-80 27 80M140 361h241m-254 26h268"/></g>${character(0, 147, 303, .58)}${character(1, 229, 304, .61)}${character(2, 315, 255, .62)}${character(3, 419, 337, .69)}${character(4, 324, 350, .64, "hat")}<ellipse cx="224" cy="378" rx="31" ry="11" fill="#fff6d9"/><path d="m210 374 10-13 12 14Zm23 0 9-10 7 12Z" fill="#eabf68"/>${fish(454, 422, .5)}`;
  }
  function wordPicture(word) {
    const icons = {
      ship: '<path d="M15 47h72L73 65H30Z" fill="#bf8064"/><path d="M48 45V8l-28 34h28Zm6-28 24 25H54Z" fill="#faf2d1"/><path d="M9 70q11-7 22 0t22 0 22 0 19 0" stroke="#79adb7"/>',
      shop: '<path d="M19 30h63v40H19Z" fill="#e5c592"/><path d="m14 14-3 20q8 9 16 0 8 9 16 0 8 9 16 0 8 9 16 0 8 9 16 0l-7-20Z" fill="#9cbf9c"/><path d="M27 44h19v26H27Zm31 0h16v14H58Z" fill="#f9f0d7"/>',
      fish: fish(52, 42, 1.1),
      dish: '<ellipse cx="50" cy="47" rx="39" ry="21" fill="#abcbd1"/><ellipse cx="50" cy="43" rx="29" ry="13" fill="#f5f1da"/>',
      chip: '<path d="M37 11c29-5 45 39 21 53C29 85 6 16 37 11Z" fill="#ecc36b"/><path d="m33 24 19 30m-10-34 17 27m-30-12 14 23" stroke="#c79647"/>',
      chick: character(1, 51, 44, .4),
      chin: `<ellipse cx="50" cy="32" rx="27" ry="29" fill="#edc89f"/>${eyes(41, 24, 19)}<path d="M76 64 63 53m1 8-1-8 8 1" stroke="#ba704e" stroke-width="4"/><path d="M39 56q12 9 23-1" stroke="#ba704e" stroke-width="4"/>`,
      chop: '<rect x="9" y="54" width="81" height="15" rx="6" fill="#ddba84"/><path d="m25 48 32-9 5 9Z" fill="#eda966"/><path d="m24 49 2-8m11 5 2-9m10 6 2-9" stroke="#a8744b"/><path d="m41 16 6 29 30-8-4-22Z" fill="#dae3df"/><path d="m73 15 13-4 4 11-14 4Z" fill="#829a78"/>',
      thin: '<path d="m17 64 63-46" stroke="#aa8662" stroke-width="5"/><path d="m46 43 2-16m12 7 16 3" stroke="#aa8662" stroke-width="4"/>',
      thick: '<path d="m18 59 12-35 48-7 7 32-55 23Z" fill="#b58964"/><ellipse cx="28" cy="48" rx="15" ry="23" fill="#e1c59b"/><ellipse cx="28" cy="48" rx="6" ry="13"/><path d="m47 29 22-5M48 57l25-10"/>',
      moth: character(2, 50, 42, .39),
      bath: '<path d="M13 37h75L77 65H27Z" fill="#bdd9db"/><path d="M25 37V14q0-12 14-5m-9 57-3 7m48-7 3 7"/><circle cx="42" cy="29" r="9" fill="#f5fbec"/><circle cx="57" cy="27" r="12" fill="#f5fbec"/><circle cx="72" cy="30" r="8" fill="#f5fbec"/>',
      what: '<path d="m22 25 28-12 29 12-29 13Z" fill="#e8c08d"/><path d="M22 25v34l28 14 29-14V25L50 38Z" fill="#f1d4a5"/><path d="M42 46q0-10 9-8t1 14v4m-1 7v1" stroke="#9d724d" stroke-width="4"/>',
      when: '<rect x="19" y="15" width="64" height="55" rx="6" fill="#fff4d9"/><path d="M19 31h64V21q0-6-6-6H25q-6 0-6 6Z" fill="#d99179"/><path d="M34 9v13m34-13v13"/><circle cx="51" cy="51" r="11" fill="#eed49b"/><path d="M51 44v8l5 2"/>',
      where: '<path d="m12 29 25-10 27 8 26-9v45l-26 9-27-8-25 9Z" fill="#d1dfb1"/><path d="M37 19v45m27-37v45" stroke="#9eb086"/><path d="M47 29c0-23 31-23 31 0 0 10-15 24-15 24S47 39 47 29Z" fill="#d78970"/><circle cx="63" cy="27" r="6" fill="#fbe8bc"/>',
      whale: character(3, 53, 39, .4),
      duck: character(4, 56, 37, .39),
      sock: '<path d="M37 9h30v36q-3 15-22 20L23 71Q5 63 20 52l16-9Z" fill="#d1b7d9"/><path d="M37 10h30v12H37Z" fill="#9476aa"/><path d="M19 52q15 5 15 15m20-30h12" stroke="#9476aa" stroke-width="5"/>',
      rock: '<path d="m12 56 12-26 32-14 26 21 10 26-40 9Z" fill="#b3b7a7"/><path d="m24 30 24 10 8-24m-8 24 4 32m-4-32 34-3" stroke="#8c9889"/>',
      sack: sack(51, 43, .78)
    };
    return icons[word] || "";
  }
  function scene(page) {
    const id = page.friend;
    let art = landscape();
    if (page.scene === "meet") {
      if (id === 0) art += `<ellipse cx="260" cy="384" rx="95" ry="15" fill="#b0c593" stroke="none"/>${sack(389, 359, .77)}${character(id, 256, 278, 1.37)}${symbol("shell", 115, 161, 1.15)}<path d="m154 156 29 9m-36 7 22 9" stroke="#91ac87" stroke-dasharray="4 7"/>`;
      if (id === 1) art += `${character(0, 99, 297, .6)}${sack(399, 379, .62)}${character(id, 286, 285, 1.55)}<path d="m184 331-13-4m21 19-19 2m213-124 13-9m-3 33 17-3" stroke="#bb9b63"/>${symbol("train", 138, 150, 1.25)}`;
      if (id === 2) art += `${character(0, 91, 332, .47)}${character(1, 155, 342, .49)}${sack(404, 381, .6)}${character(id, 298, 251, 1.5)}${symbol("feather", 422, 180, 1.15)}<path d="M341 213q36-4 47-21m-40 33 26-3" stroke="#b2a5bd" stroke-dasharray="5 7"/>`;
      if (id === 3) art += `${character(0, 107, 290, .5)}${character(1, 177, 308, .55)}${character(2, 157, 204, .5)}${character(id, 332, 324, 1.49)}${sack(457, 429, .55)}${symbol("wind", 316, 149, 1.25)}<path d="M302 215q-5-17 8-30m7 33q9-12 10-22" stroke="#82abb1" stroke-width="3"/>`;
      if (id === 4) art += `<ellipse cx="260" cy="399" rx="98" ry="14" fill="#afc491" stroke="none"/>${character(id, 272, 280, 1.42)}${sack(386, 204, .75, -19)}<path d="m372 227-39 34" stroke="#eabd63" stroke-width="12"/>${symbol("clock", 129, 168, 1.05)}<path d="m198 392-20 1m24-11-13-9m155 20 18 1m-21-12 13-8" stroke="#bb8665"/>`;
    } else if (page.scene === "splash") {
      art += `${character(0, 172, 291, 1.13)}${sack(374, 353, 1, 18)}<path d="m324 340-21-22m65 2 2-22m38 39 17-21m-99 53 28 2m32 4 24-3" stroke="#6dabb6" stroke-width="4"/>${fish(435, 411, .72)}<path d="M60 139h130q40 0 25-25M94 159h153m-189 20h118q30 0 17 22" stroke="#abc29c" stroke-width="3"/>`;
    } else if (page.scene === "log") {
      art += `${character(0, 108, 294, .68)}<path d="m239 358 172-25 9 38-172 27Z" fill="#b28b62"/><ellipse cx="245" cy="378" rx="13" ry="22" fill="#dbc299"/><ellipse cx="245" cy="378" rx="5" ry="12"/><path d="m272 369 98-16m-92 31 85-15" stroke="#8c704e"/>${character(1, 289, 277, 1.23, "log")}${sack(446, 407, .7)}<path d="m228 234-13-18m95-21 5-23m25 71 26-6" stroke="#c3a164"/><path d="m226 241-13-7-5 12 13 5Zm93-30 13-5 6 12-13 5Z" fill="#f4d585"/>`;
    } else if (page.scene === "stick") {
      art += `${character(1, 108, 337, .63)}${character(2, 250, 235, 1.17)}<path d="m269 272 108 93m-34-31 2-17" stroke="#967551" stroke-width="6"/>${fish(388, 369, .78)}${sack(470, 408, .68)}<path d="m209 292-15 19m130-73 21 3" stroke="#bba6c5" stroke-dasharray="3 6"/>`;
    } else if (page.scene === "puff") {
      art += `${character(3, 239, 363, 1.19)}${character(4, 437, 268, .95, "hat")}<path d="M227 286q-21-110 47-142 79-38 126 32m-155 90q-8-95 52-112" stroke="#fff8e7" stroke-width="14"/><path d="M245 270q-7-92 54-114 48-13 84 10" stroke="#8fbcb8" stroke-width="2" stroke-dasharray="5 9"/><path d="m401 152-9-13m55 11 8-16m-26 6 2-16" stroke="#b99863"/>${character(2, 102, 203, .59)}`;
    } else if (page.scene === "picnic") {
      art += picnic();
      art += `<path d="m227 158 5-11 5 11 12 2-9 8 2 12-10-6-10 6 2-12-9-8Z" fill="#e5be6b" stroke="none"/><path d="m348 127 4-8 4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6Z" fill="#c3a4ca" stroke="none"/>`;
    } else if (page.scene === "practice") {
      if (page.finish) art += `<g transform="translate(53 23) scale(.82)">${picnic()}</g>`;
      else if (id < 3) art += sack(448, 408, .55);
      else art += character(4, 444, 366, .5, "hat");
      art += `<circle cx="274" cy="244" r="109" fill="${friends[id].pale}" stroke="none"/>${character(id, 276, 276, id === 3 ? 1.02 : 1.1)}`;
      const spots = [[110, 164, -10], [442, 158, 9], [99, 320, 7], [450, 302, -8]];
      page.words.forEach((word, i) => {
        const [x, y, rotation] = spots[i];
        art += `<g transform="translate(${x} ${y}) rotate(${rotation})"><rect x="-42" y="-42" width="84" height="84" rx="14" fill="#fffcf0" stroke="#c5d2b6"/><g transform="translate(-39 -32) scale(.78)">${wordPicture(word)}</g></g>`;
      });
    }
    return `${svgStart("0 0 560 470", page.alt).replace("<svg ", '<svg class="scene" preserveAspectRatio="xMidYMid slice" ')}${art}</svg>`;
  }

  const $ = (id) => document.getElementById(id);
  const bookPage = $("book-page");
  const speechAvailable = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  const synth = speechAvailable ? window.speechSynthesis : null;
  let currentPage = 0;
  let speechToken = 0;
  let currentUtterance = null;
  let readingPage = false;
  const visited = new Set();
  const escapeHTML = (value) => value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  function highlight(word) {
    return escapeHTML(word).replace(/sh|ch|th|wh|ck/gi, (match) => {
      const friend = friends.find((f) => f.sound === match.toUpperCase());
      return `<strong class="digraph" style="--sound-color:${friend.color}">${match.toUpperCase()}</strong>`;
    });
  }
  function words(text) {
    const parts = text.split(/([A-Za-z]+(?:[’'][A-Za-z]+)*)/g);
    return parts.map((part, index) => {
      if (index % 2 === 0) return escapeHTML(part);
      // Keep punctuation attached to its word, including when a heading wraps on phones.
      const punctuation = (parts[index + 1] || "").match(/^[.,!?;:]+/)?.[0] || "";
      if (punctuation) parts[index + 1] = parts[index + 1].slice(punctuation.length);
      return `<button class="word" type="button" data-word="${escapeHTML(part)}" data-punctuation="${escapeHTML(punctuation)}" aria-label="Hear ${escapeHTML(part)}">${highlight(part)}${escapeHTML(punctuation)}</button>`;
    }).join("");
  }
  function navMarkup() {
    $("friend-nav").innerHTML = friends.map((friend, id) => `<button class="friend-tab" type="button" data-friend="${id}" style="--friend-color:${friend.color};--friend-pale:${friend.pale}" aria-label="Meet ${friend.name}, ${friend.sound} sound" aria-current="false"><span class="friend-avatar">${svgStart("-83 -116 166 178")}${character(id, 0, 0, id === 3 ? .8 : 1)}</svg></span><span><span class="friend-letters">${friend.sound}</span><span class="friend-name">${friend.name} ${friend.animal}</span></span><span class="friend-check" aria-hidden="true">✦</span></button>`).join("");
    $("page-dots").innerHTML = pages.map((p, index) => `<button type="button" class="page-dot" data-page="${index}" aria-label="Page ${index + 1}: ${escapeHTML(p.title)}" title="Page ${index + 1}: ${escapeHTML(p.title)}"></button>`).join("");
  }
  function stopSpeech() {
    speechToken++;
    if (synth) synth.cancel();
    currentUtterance = null;
    readingPage = false;
    document.querySelectorAll(".is-speaking").forEach((el) => el.classList.remove("is-speaking"));
    $("read-page").querySelector("span").textContent = "Read to me";
    $("read-page").setAttribute("aria-label", "Read this page aloud");
    $("read-page").setAttribute("aria-pressed", "false");
  }
  function render(index, updateURL = true) {
    stopSpeech();
    currentPage = Math.max(0, Math.min(pages.length - 1, index));
    visited.add(currentPage);
    const page = pages[currentPage];
    const friend = friends[page.friend];
    document.documentElement.style.setProperty("--accent", friend.color);
    document.documentElement.style.setProperty("--pale", friend.pale);
    $("chapter-label").textContent = `Chapter ${page.friend + 1} · The ${friend.sound} sound`;
    bookPage.className = `book-page page-enter${page.words ? " practice-page" : ""}`;
    const copy = page.words ? `<p class="practice-intro">Tap. Listen. Your turn!<br>Say each little line after me.</p><div class="practice-grid">${page.words.map((word, i) => `<div class="practice-card">${svgStart("0 0 100 80")}${wordPicture(word)}</svg>${words(word)}<p class="repeat-sentence">${words(page.repeats[i])}</p></div>`).join("")}</div>` : `<div class="story-lines">${page.lines.map((line) => `<p class="sentence">${words(line)}</p>`).join("")}</div>`;
    bookPage.innerHTML = `<div class="page-copy"><div class="page-eyebrow">${page.kind} ${page.words ? "· 4 little words" : ""}</div><h2 class="page-title" id="page-title">${words(page.title)}</h2>${copy}<div class="catchphrase">${words(page.finish ? "We did it! Let’s have a snack!" : friend.catchphrase)}</div>${page.finish ? '<p class="finish-note">✦ Five sounds. One happy picnic. The end!</p>' : `<div class="sound-note"><span aria-hidden="true">✧</span><div><b>${friend.sound} says…</b><br>${friend.habit}</div></div>`}</div><div class="illustration">${scene(page)}<span class="art-caption">${page.scene === "picnic" || page.finish ? "Good friends make the best picnics." : `${friend.name}’s special symbol: a ${friend.symbol === "wind" ? "wind swirl" : friend.symbol}`}</span></div>`;
    $("page-kind").innerHTML = `<span class="kind-dots" aria-hidden="true">${[0, 1, 2].map((n) => `<i class="${currentPage % 3 === n ? "active" : ""}"></i>`).join("")}</span> ${page.kind}`;
    $("page-count").innerHTML = `Page <b>${currentPage + 1}</b> of ${pages.length}`;
    $("previous-page").disabled = currentPage === 0;
    $("next-label").textContent = currentPage === pages.length - 1 ? "Again" : "Next";
    $("next-page").setAttribute("aria-label", currentPage === pages.length - 1 ? "Read again from page 1" : "Next page");
    document.querySelectorAll(".friend-tab").forEach((tab, i) => tab.setAttribute("aria-current", String(i === page.friend)));
    document.querySelectorAll(".page-dot").forEach((dot, i) => {
      if (i === currentPage) dot.setAttribute("aria-current", "page"); else dot.removeAttribute("aria-current");
      dot.classList.toggle("visited", visited.has(i) && i !== currentPage);
    });
    if (speechAvailable) $("audio-status").textContent = "";
    if (updateURL) {
      try { history.replaceState(null, "", `#page-${currentPage + 1}`); } catch (_) { /* The reader also works in restricted local-file previews. */ }
      if (window.innerWidth <= 580 && document.querySelector(".reader").getBoundingClientRect().top < 0) {
        document.querySelector(".reader").scrollIntoView({ block: "start", behavior: "auto" });
      }
    }
  }
  function voice() {
    const available = synth.getVoices();
    return available.find((v) => /^en[-_]US$/i.test(v.lang) && /samantha|aria|jenny|google us english/i.test(v.name)) || available.find((v) => /^en[-_]US$/i.test(v.lang)) || available.find((v) => /^en\b/i.test(v.lang));
  }
  function speak(text, { element = null, onDone = null, token = speechToken, onBoundary = null } = {}) {
    if (!speechAvailable) {
      $("audio-status").textContent = "Word audio is unavailable in this browser. Try Chrome, Edge, or Safari with an English voice enabled.";
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    currentUtterance = utterance; // Keep the current utterance alive until the browser finishes.
    utterance.lang = "en-US";
    utterance.rate = .78;
    utterance.pitch = 1.08;
    const selected = voice();
    if (selected) utterance.voice = selected;
    if (element) element.classList.add("is-speaking");
    utterance.onboundary = (event) => { if (token === speechToken && onBoundary) onBoundary(event); };
    utterance.onend = () => {
      if (token !== speechToken) return;
      if (element) element.classList.remove("is-speaking");
      currentUtterance = null;
      if (onDone) onDone();
    };
    utterance.onerror = (event) => {
      if (token !== speechToken || event.error === "canceled" || event.error === "interrupted") return;
      stopSpeech();
      $("audio-status").textContent = "The voice could not play. Check your sound and English voice settings, then tap a word to try again.";
    };
    synth.speak(utterance);
  }
  function readPage() {
    if (readingPage) { stopSpeech(); return; }
    stopSpeech();
    if (!speechAvailable) { speak(""); return; }
    $("audio-status").textContent = "";
    readingPage = true;
    $("read-page").querySelector("span").textContent = "Stop reading";
    $("read-page").setAttribute("aria-label", "Stop reading aloud");
    $("read-page").setAttribute("aria-pressed", "true");
    const token = speechToken;
    const segments = [bookPage.querySelector("h2")];
    if (pages[currentPage].words) {
      bookPage.querySelectorAll(".practice-card").forEach((card) => { segments.push(card.querySelector(":scope > .word"), card.querySelector(".repeat-sentence")); });
    } else segments.push(...bookPage.querySelectorAll(".sentence"));
    segments.push(bookPage.querySelector(".catchphrase"));
    let index = 0;
    const advance = () => {
      if (token !== speechToken) return;
      if (index >= segments.length) { stopSpeech(); return; }
      const segment = segments[index++];
      const buttons = segment.matches(".word") ? [segment] : Array.from(segment.querySelectorAll(".word"));
      // Reconstruct original case: highlighted uppercase letters must not be spelled as acronyms.
      const clone = segment.cloneNode(true);
      if (clone.matches(".word")) clone.textContent = clone.dataset.word + clone.dataset.punctuation;
      else clone.querySelectorAll(".word").forEach((word) => { word.textContent = word.dataset.word + word.dataset.punctuation; });
      const text = clone.textContent;
      let cursor = 0;
      const positions = buttons.map((button) => {
        const start = text.indexOf(button.dataset.word, cursor);
        cursor = start + button.dataset.word.length;
        return { button, start, end: cursor };
      });
      speak(text, { token, element: buttons.length === 1 ? buttons[0] : null, onBoundary: (event) => {
        if (event.name !== "word") return;
        buttons.forEach((button) => button.classList.remove("is-speaking"));
        const active = positions.find((p) => event.charIndex >= p.start && event.charIndex < p.end);
        if (active) active.button.classList.add("is-speaking");
      }, onDone: () => {
        buttons.forEach((button) => button.classList.remove("is-speaking"));
        // Practice sentences leave a generous turn for the child to repeat.
        window.setTimeout(advance, segment.classList.contains("repeat-sentence") ? 2300 : 400);
      } });
    };
    advance();
  }
  navMarkup();
  const hashPage = () => { const match = location.hash.match(/^#page-(\d+)$/); return match ? Math.min(14, Math.max(0, Number(match[1]) - 1)) : 0; };
  render(hashPage(), false);
  if (!speechAvailable) $("audio-status").textContent = "Word audio is unavailable in this browser. Read together, or try a browser with an English voice enabled.";
  if (synth) { synth.getVoices(); synth.addEventListener("voiceschanged", () => synth.getVoices()); }
  $("friend-nav").addEventListener("click", (event) => { const tab = event.target.closest("[data-friend]"); if (tab) render(Number(tab.dataset.friend) * 3); });
  $("page-dots").addEventListener("click", (event) => { const dot = event.target.closest("[data-page]"); if (dot) render(Number(dot.dataset.page)); });
  $("previous-page").addEventListener("click", () => render(currentPage - 1));
  $("next-page").addEventListener("click", () => render(currentPage === 14 ? 0 : currentPage + 1));
  $("read-page").addEventListener("click", readPage);
  bookPage.addEventListener("click", (event) => {
    const word = event.target.closest(".word");
    if (!word) return;
    stopSpeech();
    $("audio-status").textContent = "";
    speak(word.dataset.word, { element: word });
  });
  document.addEventListener("keydown", (event) => {
    if ($("grownup-dialog").open || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName) || event.target.isContentEditable) return;
    if (event.key === "ArrowLeft") { event.preventDefault(); render(currentPage - 1); }
    if (event.key === "ArrowRight") { event.preventDefault(); render(Math.min(14, currentPage + 1)); }
  });
  let touchStart = null;
  bookPage.addEventListener("touchstart", (event) => {
    touchStart = event.target.closest(".illustration") && event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
  }, { passive: true });
  bookPage.addEventListener("touchend", (event) => {
    if (!touchStart) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) render(Math.max(0, Math.min(14, currentPage + (dx < 0 ? 1 : -1))));
    touchStart = null;
  }, { passive: true });
  bookPage.addEventListener("touchcancel", () => { touchStart = null; }, { passive: true });
  window.addEventListener("hashchange", () => render(hashPage(), false));
  document.addEventListener("visibilitychange", () => { if (document.hidden) stopSpeech(); });
  window.addEventListener("pagehide", stopSpeech);
  $("grownup-open").addEventListener("click", () => { stopSpeech(); $("grownup-dialog").showModal(); });
  $("grownup-close").addEventListener("click", () => $("grownup-dialog").close());
  $("grownup-dialog").addEventListener("click", (event) => { if (event.target === $("grownup-dialog")) { const rect = event.target.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) event.target.close(); } });
})();

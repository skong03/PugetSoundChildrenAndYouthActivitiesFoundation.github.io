(() => {
  'use strict';

  const form = document.getElementById('buddy-form');
  const input = document.getElementById('number-input');
  const error = document.getElementById('number-error');
  const sheet = document.getElementById('print-sheet');
  const status = document.getElementById('buddy-status');
  const columnsInput = document.getElementById('columns-input');
  const columnsHelp = document.getElementById('columns-help');
  const copiesInput = document.getElementById('copies-input');
  const presets = [...document.querySelectorAll('[data-number]')];
  const minimum = 1;
  const maximum = 100;
  const cell = 60;
  const maxColumns = 10;
  const maxRows = 14;
  // SVG units are CSS pixels at 96 dpi. Copies share one scale and never enlarge cells.
  const pageWidth = 210 * 96 / 25.4;
  const pageHeight = 297 * 96 / 25.4;
  const palette = ['#e57e71', '#eeab65', '#f0cf66', '#8ebc77', '#75b8b4', '#a997ca', '#e7a2b9', '#82afd4', '#b7c879', '#e6b677'];
  let currentNumber = 6;

  function readNumber() {
    const number = input.valueAsNumber;
    const valid = Number.isInteger(number) && number >= minimum && number <= maximum;
    error.hidden = valid;
    error.textContent = valid ? '' : '请输入 1 到 100 之间的整数；每个数字对应一块积木。';
    input.setAttribute('aria-invalid', String(!valid));
    document.getElementById('print-button').disabled = !valid;
    return valid ? number : null;
  }

  function render() {
    const number = readNumber();
    if (number === null) return false;
    currentNumber = number;
    const tall = form.elements.layout.value === 'tall';
    const outline = form.elements.style.value === 'outline';
    const minColumns = Math.ceil(number / maxRows);
    const availableColumns = Math.min(maxColumns, number);
    // Keep explicit choices when possible; changing the total may require a new layout.
    const resetColumns = columnsInput.value !== 'auto' &&
      (Number(columnsInput.value) < minColumns || Number(columnsInput.value) > availableColumns);
    if (resetColumns) columnsInput.value = 'auto';
    [...columnsInput.options].forEach((option) => {
      if (option.value === 'auto') return;
      const count = Number(option.value);
      option.disabled = count < minColumns || count > availableColumns;
    });
    columnsHelp.textContent = `${resetColumns ? '已切回自动排列。' : ''}当前可选 ${minColumns}–${availableColumns} 列，每列最多 ${maxRows} 格。`;
    const automaticColumns = tall ? minColumns : Math.min(maxColumns, Math.ceil(Math.sqrt(number)));
    const columns = columnsInput.value === 'auto' ? automaticColumns : Number(columnsInput.value);
    const rows = Math.ceil(number / columns);
    const width = columns * cell;
    const height = rows * cell;
    const left = (pageWidth - width) / 2;
    const top = (pageHeight - height) / 2 + 18;
    const ink = '#34483d';
    const color = palette[(number - 1) % palette.length];
    const limbColor = outline ? ink : '#52664c';
    const blocks = [];
    // Fill from the bottom, so incomplete rows always sit on a supported base.
    for (let index = 0; index < number; index += 1) {
      const column = index % columns;
      const row = rows - 1 - Math.floor(index / columns);
      blocks.push(`<rect class="buddy-cell" x="${left + column * cell}" y="${top + row * cell}" width="${cell}" height="${cell}" fill="${outline ? '#fff' : color}" stroke="${ink}" stroke-width="2"/>`);
    }
    const topCount = number - (rows - 1) * columns;
    // A complete row gives both eyes a solid home, even for a partial top row.
    const faceScale = cell / 100;
    const faceY = top + (topCount < columns && rows > 1 ? cell : 0) + 43 * faceScale;
    const faceX = left + width / 2;
    const eyeOffset = columns === 1 ? 21 : 38;
    const eyeRadius = columns === 1 ? 16 : 21;
    const armY = top + height - Math.min(height / 2, 65);
    const bottom = top + height;
    const footOffset = width === cell ? 24 * faceScale : Math.min(width / 3, 85);
    const eye = (x) => `<ellipse cx="${x}" cy="0" rx="${eyeRadius}" ry="${eyeRadius + 3}" fill="white" stroke="${ink}" stroke-width="2.5"/><ellipse cx="${x + 2}" cy="2" rx="6" ry="9" fill="${ink}"/><circle cx="${x + 4}" cy="-2" r="2.3" fill="white"/>`;

    const character = `<text x="${left + topCount * cell / 2}" y="${top - 26}" fill="${ink}" font-size="64" font-weight="800">${number}</text>
        <g fill="none" stroke="${limbColor}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round">
          <path d="M ${left + 4} ${armY} Q ${left - 18} ${armY + 14} ${left - 24} ${armY - 7} M ${left + width - 4} ${armY} Q ${left + width + 20} ${armY + 10} ${left + width + 24} ${armY - 14}"/>
          <path d="M ${faceX - footOffset} ${bottom - 3} v 27 h -14 M ${faceX + footOffset} ${bottom - 3} v 27 h 14"/>
        </g>
        ${blocks.join('')}
        <g transform="translate(${faceX} ${faceY}) scale(${faceScale})">
          ${eye(-eyeOffset)}${eye(eyeOffset)}
          <path d="M -13 29 Q 0 43 13 29" fill="none" stroke="${ink}" stroke-width="3.5" stroke-linecap="round"/>
        </g>`;
    const copies = Number(copiesInput.value);
    const sheetColumns = copies === 9 ? 3 : copies >= 4 ? 2 : 1;
    const sheetRows = Math.ceil(copies / sheetColumns);
    const gap = 24;
    const slotWidth = (pageWidth - 76 - gap * (sheetColumns - 1)) / sheetColumns;
    const slotHeight = (pageHeight - 202 - gap * (sheetRows - 1)) / sheetRows;
    // Reserve room for the number, hands and feet as well as the square grid.
    const scale = copies === 1 ? 1 : Math.min(1, slotWidth / (width + 80), slotHeight / (height + 140));
    const cellMillimeters = (cell * scale * 25.4 / 96).toFixed(1);
    const characters = Array.from({ length: copies }, (_, index) => {
      const centerX = 38 + (index % sheetColumns) * (slotWidth + gap) + slotWidth / 2;
      const centerY = 92 + Math.floor(index / sheetColumns) * (slotHeight + gap) + slotHeight / 2;
      const x = copies === 1 ? 0 : centerX - pageWidth / 2 * scale;
      const y = copies === 1 ? 0 : centerY - (top + height / 2 - 27) * scale;
      return `<g class="buddy-character" transform="translate(${x} ${y}) scale(${scale})">${character}</g>`;
    });

    sheet.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${pageWidth} ${pageHeight}" width="210mm" height="297mm" role="img" aria-labelledby="buddy-title buddy-description">
      <title id="buddy-title">${copies} 个数字 ${number} 的积木小伙伴</title>
      <desc id="buddy-description">每个角色由 ${number} 个正方形组成，${columns} 列、${rows} 行；本页 ${copies} 个角色，每格边长约 ${cellMillimeters} 毫米，${outline ? '黑白涂色' : '彩色'}版本。适合 A4 纸按百分之百比例打印。</desc>
      <rect width="${pageWidth}" height="${pageHeight}" fill="white"/>
      <g font-family="'Avenir Next', 'PingFang SC', 'Microsoft YaHei', sans-serif" text-anchor="middle">
        <text x="${pageWidth / 2}" y="64" fill="#687568" font-size="12" letter-spacing="3">M E E T  M Y  N U M B E R  B U D D Y</text>
        ${characters.join('')}
        <text x="${pageWidth / 2}" y="${pageHeight - 65}" font-size="17" fill="${ink}" font-weight="600">${copies === 1 ? `${number} 块积木，${number} 个小小的可能。` : `${copies} 个小伙伴 · 每个 ${number} 块积木`}</text>
        <text x="${pageWidth / 2}" y="${pageHeight - 42}" font-size="10" fill="#748071" letter-spacing="1.5">NUMBER BUDDIES · 数一数，涂一涂，玩起来</text>
      </g>
    </svg>`;
    status.textContent = `本页 ${copies} 个角色 · 每个 ${number} 块（${columns} 列 × ${rows} 行）· 每格约 ${cellMillimeters} mm`;
    presets.forEach((button) => button.setAttribute('aria-pressed', String(Number(button.dataset.number) === number)));
    document.getElementById('decrease').disabled = number <= minimum;
    document.getElementById('increase').disabled = number >= maximum;
    return true;
  }

  function choose(number) {
    input.value = String(Math.max(minimum, Math.min(maximum, number)));
    render();
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!render()) input.focus();
  });
  input.addEventListener('input', render);
  columnsInput.addEventListener('change', render);
  copiesInput.addEventListener('change', render);
  form.querySelectorAll('input[type="radio"]').forEach((radio) => radio.addEventListener('change', () => {
    if (radio.name === 'layout') columnsInput.value = 'auto';
    render();
  }));
  document.getElementById('decrease').addEventListener('click', () => choose(currentNumber - 1));
  document.getElementById('increase').addEventListener('click', () => choose(currentNumber + 1));
  presets.forEach((button) => button.addEventListener('click', () => choose(Number(button.dataset.number))));
  document.getElementById('print-button').addEventListener('click', () => {
    if (render()) window.print();
  });
  render();
})();

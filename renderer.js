import { getColumnCount } from "./algorithm.js";

// 결과 출력
export function renderTables(tables) {
  resultArea.innerHTML = "";
  const columns = getColumnCount(tables.length);

  for (let i = 0; i < tables.length; i += columns) {
    const row = document.createElement("div");
    const rowTables = tables.slice(i, i + columns);

    row.className = "table-row";
    rowTables.forEach((table) => {
      const card = createTableCard(table);
      row.appendChild(card);
    });

    resultArea.appendChild(row);
  }
}

function createTableCard(table) {
  const card = document.createElement("div");
  card.className = "table-card";
  card.innerHTML = `
        <h3>TABLE ${table.table}</h3>
        <div class="people">
            <h4>👨 남성</h4>
            <div class="member-list male-list"></div>
        </div>

        <div class="people">
            <h4>👩 여성</h4>
            <div class="member-list female-list"></div>
        </div>
    `;

  const maleList = card.querySelector(".male-list");
  const femaleList = card.querySelector(".female-list");

  table.male.forEach((number) => {
    maleList.appendChild(createTag(number, "male"));
  });

  table.female.forEach((number) => {
    femaleList.appendChild(createTag(number, "female"));
  });

  return card;
}

// 번호 태그 생성
function createTag(number, gender) {
  const span = document.createElement("span");

  span.className = `member-number ${gender}`;
  span.textContent = number;

  return span;
}

import { getTableLayout } from "./algorithm.js";

// 결과 출력
export function renderTables(tables, tablesPerRow = 3, container) {
  if (!container) {
    return;
  }

  container.innerHTML = "";
  container.style.setProperty("--cards-per-row", tablesPerRow);

  const layoutRows = getTableLayout(tables.length, tablesPerRow);

  layoutRows.forEach((row) => {
    const rowContainer = document.createElement("div");
    rowContainer.className = "result-row";

    row.forEach((tableNumber) => {
      const table = tables[tableNumber - 1];
      const card = createTableCard(table);
      card.style.setProperty("--card-index", tableNumber);
      rowContainer.appendChild(card);
    });

    container.appendChild(rowContainer);
  });
}

function createTableCard(table) {
  const card = document.createElement("div");
  card.className = "table-card";
  card.innerHTML = `
        <h3>TABLE ${table.table}</h3>
        <div class="people">
            <div class="member-list male-list">👨 남성: </div>
        </div>

        <div class="people">
            <div class="member-list female-list">👩 여성: </div>
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

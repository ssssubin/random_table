import { generateSeat } from "./algorithm.js";
import { renderTables } from "./renderer.js";

// ===============================
// DOM
// ===============================
const maleCountInput = document.getElementById("maleCount");
const femaleCountInput = document.getElementById("femaleCount");
const tableCountInput = document.getElementById("tableCount");

const maleGroups = document.getElementById("maleGroups");
const femaleGroups = document.getElementById("femaleGroups");

const addMaleGroupBtn = document.getElementById("addMaleGroup");
const addFemaleGroupBtn = document.getElementById("addFemaleGroup");

const generateBtn = document.getElementById("generateBtn");

const resultArea = document.getElementById("resultArea");
const errorMessage = document.getElementById("errorMessage");

// 마지막 조건 저장
let latestCondition = null;

// ===============================
// 그룹 추가
// ===============================

addMaleGroupBtn.addEventListener("click", () => {
  createGroupInput(maleGroups, "남성");
});

addFemaleGroupBtn.addEventListener("click", () => {
  createGroupInput(femaleGroups, "여성");
});

// ===============================
// 그룹 Input 생성
// ===============================

function createGroupInput(container, gender) {
  const group = document.createElement("div");

  group.className = "group";
  group.innerHTML = `
        <input
            type="text"
            placeholder="${gender} 번호 입력 (예 : 1,3,5)"
        >
        <button class="remove-btn">✕</button>
    `;

  group.querySelector(".remove-btn").addEventListener("click", () => {
    group.remove();
  });

  container.appendChild(group);
}

// ===============================
// 그룹 읽기
// ===============================
function getGroups(container) {
  const groups = [];

  const inputs = container.querySelectorAll("input");
  inputs.forEach((input) => {
    const value = input.value.trim();
    if (value === "") return;

    const members = value
      .split(",")
      .map((v) => Number(v.trim()))
      .filter((v) => !isNaN(v));

    groups.push(members);
  });

  return groups;
}

// 조건 읽기
function getCondition() {
  return {
    maleCount: Number(maleCountInput.value),
    femaleCount: Number(femaleCountInput.value),
    tableCount: Number(tableCountInput.value),

    maleGroups: getGroups(maleGroups),
    femaleGroups: getGroups(femaleGroups),
  };
}

// 랜덤 버튼
generateBtn.addEventListener("click", () => {
  errorMessage.textContent = "";
  const condition = getCondition();
  const result = generateSeat(condition);

  latestCondition = condition;
  renderTables(result);
});

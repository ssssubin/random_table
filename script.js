import { generateSeat } from "./algorithm.js";
import { renderTables } from "./renderer.js";

// ===============================
// DOM
// ===============================
const maleCountInput = document.getElementById("maleCount");
const femaleCountInput = document.getElementById("femaleCount");
const tableCountInput = document.getElementById("tableCount");
const tablesPerRowInput = document.getElementById("tablesPerRow");

const maleGroups = document.getElementById("maleGroups");
const femaleGroups = document.getElementById("femaleGroups");
const mixedGroups = document.getElementById("mixedGroups");

const addMaleGroupBtn = document.getElementById("addMaleGroup");
const addFemaleGroupBtn = document.getElementById("addFemaleGroup");
const addMixedGroupBtn = document.getElementById("addMixedGroup");

const generateBtn = document.getElementById("generateBtn");

const resultArea = document.getElementById("resultArea");
const errorMessage = document.getElementById("errorMessage");
const screenCard = document.querySelector(".screen-card");

// 마지막 조건 저장
let latestCondition = null;

// ===============================
// 그룹 추가
// ===============================

addMaleGroupBtn.addEventListener("click", () => {
  createGroupInput(maleGroups, "남성");
});

addFemaleGroupBtn.addEventListener("click", () => {
  createGroupInput(femaleGroups, "여성 번호 입력 (예 : 1,3,5)");
});

addMixedGroupBtn.addEventListener("click", () => {
  createGroupInput(mixedGroups, "혼성 그룹 입력 -> 남|여 (예 : 1,2|3,4)");
});

// ===============================
// 그룹 Input 생성
// ===============================

function createGroupInput(container, placeholder) {
  const group = document.createElement("div");

  group.className = "group";
  group.innerHTML = `
        <input
            type="text"
            placeholder="${placeholder}"
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
function parseNumbers(value) {
  return value
    .split(",")
    .map((v) => Number(v.trim()))
    .filter((v) => !isNaN(v));
}

function getGroups(container) {
  const groups = [];

  const inputs = container.querySelectorAll("input");
  inputs.forEach((input) => {
    const value = input.value.trim();
    if (value === "") return;

    const members = parseNumbers(value);
    if (members.length > 0) {
      groups.push(members);
    }
  });

  return groups;
}

function getMixedGroups(container) {
  const groups = [];

  const inputs = container.querySelectorAll("input");
  inputs.forEach((input) => {
    const value = input.value.trim();
    if (value === "") return;

    const [malePart, femalePart] = value.split(/[|/]/);
    const maleMembers = parseNumbers(malePart || "");
    const femaleMembers = parseNumbers(femalePart || "");

    if (maleMembers.length > 0 && femaleMembers.length > 0) {
      groups.push({
        male: maleMembers,
        female: femaleMembers,
      });
    }
  });

  return groups;
}

// 조건 읽기
function getCondition() {
  const tablesPerRow = Number(tablesPerRowInput.value);

  return {
    maleCount: Number(maleCountInput.value),
    femaleCount: Number(femaleCountInput.value),
    tableCount: Number(tableCountInput.value),
    tablesPerRow:
      Number.isFinite(tablesPerRow) && tablesPerRow > 0 ? tablesPerRow : 3,

    maleGroups: getGroups(maleGroups),
    femaleGroups: getGroups(femaleGroups),
    mixedGroups: getMixedGroups(mixedGroups),
  };
}

// 랜덤 버튼
generateBtn.addEventListener("click", () => {
  errorMessage.textContent = "";
  const condition = getCondition();
  const result = generateSeat(condition);

  latestCondition = condition;
  if (screenCard) {
    screenCard.classList.remove("hidden");
  }
  renderTables(result, condition.tablesPerRow, resultArea);
});

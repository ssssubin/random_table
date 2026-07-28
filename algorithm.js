// 테이블 생성
function createTables(tableCount) {
  return Array.from({ length: tableCount }, (_, i) => ({
    table: i + 1,
    male: [],
    female: [],

    maleCapacity: 0,
    femaleCapacity: 0,
  }));
}

// 테이블별 인원 계산
function calculateCapacity(totalPeople, tableCount) {
  const base = Math.floor(totalPeople / tableCount);
  const remain = totalPeople % tableCount;
  const result = [];

  for (let i = 0; i < tableCount; i++) {
    result.push(base + (i < remain ? 1 : 0));
  }

  return result;
}

// 테이블에 적용
function applyCapacity(tables, maleCount, femaleCount) {
  const maleCapacity = calculateCapacity(maleCount, tables.length);
  const femaleCapacity = calculateCapacity(femaleCount, tables.length);

  tables.forEach((table, index) => {
    table.maleCapacity = maleCapacity[index];
    table.femaleCapacity = femaleCapacity[index];
  });
}

// 그룹을 큰 순서대로 정렬
function sortGroups(groups, getLength = (group) => group.length) {
  return [...groups].sort((a, b) => getLength(b) - getLength(a));
}

// 셔플
function shuffle(array) {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

// 번호 생성
function createPeople(count) {
  return Array.from({ length: count }, (_, i) => i + 1);
}

function mergeAssignedSets(...sets) {
  const merged = new Set();

  sets.forEach((set) => {
    set.forEach((person) => merged.add(person));
  });

  return merged;
}

// 그룹 먼저 배치
function placeGroups(groups, tables, gender) {
  const assigned = new Set();
  const sortedGroups = sortGroups(groups);

  for (const group of sortedGroups) {
    const candidates = tables.filter((table) => {
      const remain =
        gender === "male"
          ? table.maleCapacity - table.male.length
          : table.femaleCapacity - table.female.length;

      return remain >= group.length;
    });

    if (candidates.length === 0) {
      throw new Error("그룹을 배치할 수 없습니다.");
    }

    let minCount = Infinity;
    candidates.forEach((table) => {
      const count = gender === "male" ? table.male.length : table.female.length;
      if (count < minCount) {
        minCount = count;
      }
    });

    const bestTables = candidates.filter((table) => {
      const count = gender === "male" ? table.male.length : table.female.length;
      return count === minCount;
    });

    const target = bestTables[Math.floor(Math.random() * bestTables.length)];
    if (gender === "male") {
      target.male.push(...group);
    } else {
      target.female.push(...group);
    }
    group.forEach((person) => assigned.add(person));
  }

  return assigned;
}

function placeMixedGroups(groups, tables) {
  const assignedMale = new Set();
  const assignedFemale = new Set();
  const sortedGroups = sortGroups(
    groups,
    (group) => group.male.length + group.female.length,
  );

  for (const group of sortedGroups) {
    const candidates = tables.filter((table) => {
      const maleRemain = table.maleCapacity - table.male.length;
      const femaleRemain = table.femaleCapacity - table.female.length;

      return (
        maleRemain >= group.male.length && femaleRemain >= group.female.length
      );
    });

    if (candidates.length === 0) {
      throw new Error("혼성 그룹을 배치할 수 없습니다.");
    }

    let minCount = Infinity;
    candidates.forEach((table) => {
      const count = table.male.length + table.female.length;
      if (count < minCount) {
        minCount = count;
      }
    });

    const bestTables = candidates.filter((table) => {
      return table.male.length + table.female.length === minCount;
    });

    const target = bestTables[Math.floor(Math.random() * bestTables.length)];
    target.male.push(...group.male);
    target.female.push(...group.female);

    group.male.forEach((person) => assignedMale.add(person));
    group.female.forEach((person) => assignedFemale.add(person));
  }

  return {
    male: assignedMale,
    female: assignedFemale,
  };
}

// 남은 사람 찾기
function getRemainingPeople(allPeople, assigned) {
  return allPeople.filter((person) => !assigned.has(person));
}

// 빈 자리 채우기
function fillTables(tables, people, gender) {
  let index = 0;

  for (const table of tables) {
    const target = gender === "male" ? table.male : table.female;
    const capacity =
      gender === "male" ? table.maleCapacity : table.femaleCapacity;

    while (target.length < capacity && index < people.length) {
      target.push(people[index++]);
    }
  }
}

export function getTableLayout(tableCount, tablesPerRow = 3) {
  if (!Number.isInteger(tableCount) || tableCount < 1) {
    return [];
  }

  if (!Number.isInteger(tablesPerRow) || tablesPerRow < 1) {
    tablesPerRow = 3;
  }

  const rows = [];
  const numbers = Array.from({ length: tableCount }, (_, i) => i + 1);
  let startIndex = 0;
  let rowIndex = 0;

  while (startIndex < numbers.length) {
    const remaining = numbers.length - startIndex;
    const rowCount = Math.min(tablesPerRow, remaining);
    const row = [];

    if (rowIndex % 2 === 0) {
      for (let i = 0; i < rowCount; i++) {
        row.push(numbers[startIndex + i]);
      }
    } else {
      for (let i = rowCount - 1; i >= 0; i--) {
        row.push(numbers[startIndex + i]);
      }
    }

    rows.push(row);
    startIndex += rowCount;
    rowIndex += 1;
  }

  return rows;
}

export function getColumnCount(tableCount, tablesPerRow = 3) {
  return Math.min(tablesPerRow, tableCount);
}

// 전체 알고리즘
export function generateSeat(condition) {
  const tables = createTables(condition.tableCount);

  applyCapacity(tables, condition.maleCount, condition.femaleCount);

  const males = createPeople(condition.maleCount);
  const females = createPeople(condition.femaleCount);

  const mixedAssigned = placeMixedGroups(condition.mixedGroups || [], tables);
  const assignedMale = mergeAssignedSets(
    placeGroups(condition.maleGroups || [], tables, "male"),
    mixedAssigned.male,
  );
  const assignedFemale = mergeAssignedSets(
    placeGroups(condition.femaleGroups || [], tables, "female"),
    mixedAssigned.female,
  );

  const remainMale = shuffle(getRemainingPeople(males, assignedMale));
  const remainFemale = shuffle(getRemainingPeople(females, assignedFemale));

  fillTables(tables, remainMale, "male");
  fillTables(tables, remainFemale, "female");

  tables.forEach((table) => {
    table.male.sort((a, b) => a - b);
    table.female.sort((a, b) => a - b);
  });

  return tables;
}

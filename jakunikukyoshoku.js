process.stdin.resume();
process.stdin.setEncoding('utf8');
// 自分の得意な言語で
// Let's チャレンジ！！
var lines = [
];
var reader = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
reader.on('line', (line) => {
    lines.push(line);
});
reader.on('close', () => {
    grid = main();
    // girdを文字列のみ出力する
    for (let i = 0; i < grid.length; i++) {
        console.log(grid[i].join(' '));
    }


});

// main関数を作成
function main() {

    // 本番用入力系
    const [zooRow, zooCol] = lines[0].split(' ').map(Number);
    const grid = lines.slice(1, zooRow + 1);
    const grid2 = grid.map((row) => row.split(' '));
    //1+ zooCol + 1行目に数値が１つ入力されるので、取得してrensaLenに格納する。
    const rensaLen = Number(lines[1 + zooRow]);
    //1+ zooCol + 2行目からrensaLen行分の半角スペース区切りの２つのアルファベットが入力されるので、取得して2次元配列「関係」に格納する。
    const kankei = [];
    for (let i = 1 + zooRow + 1; i <= 1 + zooRow + rensaLen; i++) {
        kankei.push(lines[i].split(' '));
    }

/*
    // テスト用入力系
    const [zooRow, zooCol] = [4, 4];
    const grid2 = [
        ["a", "a", "e", "b"],
        ["b", "d", "b", "c"],
        ["c", "e", "a", "d"],
        ["a", "c", "d", "b"]
    ]
    const rensaLen = 5;
    const kankei = [
        ['a', 'b'],
        ['b', 'c'],
        ['b', 'e'],
        ['d', 'b'],
        ['d', 'e']
    ]
*/

    // 取得した変数を出力する。
    //console.log({ grid2 });
    //console.log({ zooRow, zooCol });
    //console.log({ rensaLen });
    //console.log({ kankei });

    // まず、関係を受け取って、全部の一覧を作成する。
    const kankeiListAll = makeKankeiList(kankei);
    // kankeiListを出力する。
    //console.log({ kankeiListAll });

    // 次に、関係を受け取って、食べる者一覧を作成する。
    const hoshokushaList = makehoshokushaList(kankei);
    // hoshokushaListを出力する。
    //console.log({ hoshokushaList });

    // 次に、関係を受け取って、被食者一覧を作成する。
    const WorstRankList = makeWorstRankList(kankei);
    // WorstRankListを出力する。
    //console.log({ WorstRankList });


    // 次に、関係を受け取って、最強捕食者一覧を作成する。
    const firstRankList = makefirstRankList(kankei);

    // 次に、2つのグループA、グループB、関係を受け取って、グループAに食べられるグループBの要素の一覧を作成する。
    const secondRankList = makeRankList(kankei, firstRankList, hoshokushaList);

    // 2次元配列rankListを作成する。
    const rankList = [];
    // rankList[0]にfirstRankListを格納する。
    rankList.push(firstRankList);
    // hoshokushaListからfirstRankListを削除する。
    for (let i = 0; i < firstRankList.length; i++) {
        hoshokushaList.splice(hoshokushaList.indexOf(firstRankList[i]), 1);
    }


    // i=1から開始し、処理ごとに+1する。hoshokushaListが空になるまで、以下の処理を繰り返す。
    for (let i = 0; hoshokushaList.length > 0; i++) {
        // rankList[i+1]にmakeRankList(kankei, rankList[i], hoshokushaList)を格納する。
        rankList.push(makeRankList(kankei, rankList[i], hoshokushaList));
        // hoshokushaListからrankList[i+1]を削除する。
        for (let j = 0; j < rankList[i + 1].length; j++) {
            hoshokushaList.splice(hoshokushaList.indexOf(rankList[i + 1][j]), 1);
        }
    }
    // rankListを出力する。
    //console.log({ rankList });

    // eatList[l]にmakeEatList(rankList[l], kankei)の結果を格納する。
    const eatList = [];
    for (let l = 0; l < rankList.length; l++) {
        eatList.push(makeEatList(rankList[l], kankei));
    }
    //console.log({ eatList });

    // 2次元配列rankListを受け取って、killerIndexを作成する関数を作成する。
    const killerIndex = [];
    const grid3 = [];
    grid3.push(grid2);
    for (let k = 0; k < rankList.length; k++) {
        //console.log("現状のgrid3");
        //console.log(grid3[k]);
        killerIndex.push(findKillerIndex(grid3[k], rankList[k]));
        grid3.push(updateGrid(grid3[k], killerIndex[k], eatList[k]));
    }
    // grid3[]の末尾を返却する
    return grid3[rankList.length];

}







// kankeiを受け取って、一覧を作成する関数を作成する。
function makeKankeiList(kankei) {
    // kankeiを受け取って、一覧を作成す
    // まず、kankeiを受け取って、kankeiListを作成する。
    const kankeiList = [];
    for (let i = 0; i < kankei.length; i++) {
        kankeiList.push(kankei[i][0]);
        kankeiList.push(kankei[i][1]);
    }
    // kankeiListを重複を削除して、ソートする。
    const kankeiList2 = kankeiList.filter((x, i, self) => self.indexOf(x) === i).sort();
    // kankeiList2を返す。
    return kankeiList2;
}

// kankeiを受け取って、一覧を作成する関数を作成する。
function makeWorstRankList(kankei) {
    // kankeiを受け取って、一覧を作成す
    // まず、kankeiを受け取って、kankei[i][0]にのみ存在するWorstRankListを作成する。
    const kuwareruList = [];
    const kuuList = [];
    for (let i = 0; i < kankei.length; i++) {
        kuuList.push(kankei[i][0]);
        kuwareruList.push(kankei[i][1]);
    }

    // kuuList,kuwarerulistを重複を削除して、ソートする。
    const kuuList2 = kuuList.filter((x, i, self) => self.indexOf(x) === i).sort();
    const kuwareruList2 = kuwareruList.filter((x, i, self) => self.indexOf(x) === i).sort();

    // kuwareruList2に存在するが、kuuList2に存在しない要素を取得する。
    const WorstRankList = kuwareruList2.filter((x) => !kuuList2.includes(x));

    // WorstRankListを返す。
    return WorstRankList;
}

// kankeiを受け取って、捕食者一覧を作成する関数を作成する。
function makehoshokushaList(kankei) {
    // kankeiを受け取って、一覧を作成す
    // まず、kankeiを受け取って、kankei[i][0]にのみ存在するWorstRankListを作成する。
    const hoshokushaList = [];
    const kuwareruList = [];
    const kuuList = [];
    for (let i = 0; i < kankei.length; i++) {
        kuuList.push(kankei[i][0]);
        kuwareruList.push(kankei[i][1]);
    }


    // kuuList,kuwarerulistを重複を削除して、ソートする。
    const kuuList2 = kuuList.filter((x, i, self) => self.indexOf(x) === i).sort();

    // kuuList2を返す。
    return kuuList2;
}

// kankeiを受け取って、最強捕食者一覧を作成する関数を作成する。
function makefirstRankList(kankei) {
    // kankeiを受け取って、一覧を作成する。
    // まず、kankeiを受け取って、kankei[i][0]にのみ存在するfirstRankListを作成する。
    const kuwareruList = [];
    const kuuList = [];
    for (let i = 0; i < kankei.length; i++) {
        kuuList.push(kankei[i][0]);
        kuwareruList.push(kankei[i][1]);
    }

    // kuuList,kuwarerulistを重複を削除して、ソートする。
    const kuuList2 = kuuList.filter((x, i, self) => self.indexOf(x) === i).sort();
    const kuwareruList2 = kuwareruList.filter((x, i, self) => self.indexOf(x) === i).sort();

    // kuwareruList2に存在するが、kuuList2に存在しない要素を取得する。
    const firstRankList = kuuList2.filter((x) => !kuwareruList2.includes(x));

    // firstRankListを返す。
    return firstRankList;
}

// 2つのグループA、グループB、関係を受け取って、グループAに食べられるグループBの要素の一覧を返す関数を作成する。
function makeRankList(kankei, groupA, groupB) {
    // まず、kankeiを受け取って、kankei[i][0]にグループAの要素が存在するindexのリストを作成する。
    const indexList = [];
    for (let i = 0; i < kankei.length; i++) {
        if (groupA.includes(kankei[i][0])) {
            indexList.push(i);
        }
    }
    // indexListを使って、kankei[i][1]にグループBの要素が存在するindexのリストを作成する。
    const indexList2 = [];
    for (let i = 0; i < indexList.length; i++) {
        if (groupB.includes(kankei[indexList[i]][1])) {
            indexList2.push(indexList[i]);
        }
    }
    // indexList2を使って、kankei[i][1]のリストを作成する。その際、重複を削除する。
    const rankList = [];
    for (let i = 0; i < indexList2.length; i++) {
        rankList.push(kankei[indexList2[i]][1]);
    }
    // rankListを返す。
    return rankList.filter((x, i, self) => self.indexOf(x) === i).sort();
}

// grid2とrankList[i]を受け取って、rankList[i]の要素Aのgrid2のindexリストを作成する。
// 捕食者居場所リストのindex[N][M]の前後8座標を「-」に置換する関数を作成する。
function findKillerIndex(grid2, rankList) {
    // iの0からrankList.lengthまでのループを作成する。
    // grid2[N][M]から0行・０列からN行・M列まで繰り返しrankList[i]が含まれるかどうかを捜査する。
    // rankList[i]が含まれる場合、そのindexをkillerIndexに追加する。
    const killerIndex = [];
    //console.log({rankList});
    for (let i = 0; i < rankList.length; i++) {
        for (let N = 0; N < grid2.length; N++) {
            for (let M = 0; M < grid2[N].length; M++) {
                if (grid2[N][M] === rankList[i]) {
                    killerIndex.push([N, M]);
                }
            }
        }
    }
    //console.log({killerIndex});
    // killerIndexを返却する。
    return killerIndex;
}

// 次に、グループA、関係を受け取って、グループAに食べられるグループＣの要素の一覧を作成する関数。
function makeEatList(groupA, kankei) {
    // kankeiのlength分以下の処理を繰り返す。
    // kankei[i][0]がgroupAに含まれている場合、kankei[i][1]をeatListに追加する。
    const eatList = [];
    for (let i = 0; i < kankei.length; i++) {
        if (groupA.includes(kankei[i][0])) {
            eatList.push(kankei[i][1]);
        }
    }
    // eatListの重複を排除して返却する。
    return eatList.filter((x, i, self) => self.indexOf(x) === i).sort();
}

// KillerIndex、eatList、gridを受け取って、gridのKillerIndexの[N][M],[N+-1][M+-1]がeatListに含まれるとき、対象を「-」に置換する関数を作成する。
function updateGrid(grid_a, killerIndex, eatList) {
    // grid_aを出力する
    //console.log(grid_a);

    const grid = grid_a;
    // killerIndexのlength分以下の処理を繰り返す。
    for (let i = 0; i < killerIndex.length; i++) {
        // grid[killerIndex[i][0]][killerIndex[i][1]]の前後8座標がeatListに含まれる場合、対象を「-」に置換する。
        for (let N = -1; N < 2; N++) {
            for (let M = -1; M < 2; M++) {
                // killerIndex[i][0] + NとkillerIndex[i][1] + Mがgridの範囲内かどうかを確認する。
                if (killerIndex[i][0] + N < 0 || killerIndex[i][0] + N >= grid.length || killerIndex[i][1] + M < 0 || killerIndex[i][1] + M >= grid[0].length) {
                    continue;
                }
                if (eatList.includes(grid[killerIndex[i][0] + N][killerIndex[i][1] + M])) {
                    grid[killerIndex[i][0] + N][killerIndex[i][1] + M] = "-";
                }
            }
        }
    }
    // gridを出力
    //console.log(grid);
    // gridを返却する。
    return grid;
}
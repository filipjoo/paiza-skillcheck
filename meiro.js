process.stdin.resume();
process.stdin.setEncoding('utf8');
// 自分の得意な言語で
// Let's チャレンジ！！
var lines = [];
var reader = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
reader.on('line', (line) => {
    lines.push(line);
});
reader.on('close', () => {
    // ・1 行目にそれぞれグリッドの縦の長さと横の長さを表す整数 H, W がこの順で半角スペース区切りで与えられます。
    // ・続く H 行のうちの i 行目 (1 ≦ i ≦ H) には半角記号 "#", "." または半角文字 "S" からなる長さ W の文字列 s_i が与えられます。s_i の j 番目 (1 ≦ j ≦ W) の文字は i 行 j 列のグリッドの状態を表し、"#" はその場所が柱であることを、また "." はその場所が自由に行き来できることを、また "S" はその場所に最初にあなたがいることを表します ("S" の場所は自由に行き来出来ます)
    // 文字列は標準入力から渡されます。
    // グリッドから脱出できるならば "YES" を、できないならば "NO" を出力してください。
    // 出力の最後に改行を入れ、余計な文字、空行を含んではいけません。

    // 1行目にそれぞれグリッドの縦の長さと横の長さを表す整数 H, W がこの順で半角スペース区切りで与えられます。
    const [meiroRow, meiroCol] = lines[0].split(' ').map(Number);
    // console.log("迷路サイズ:", { meiroRow }, { meiroCol });

    // 続く H 行のうちの i 行目 (1 ≦ i ≦ H) には半角記号 "#", "." または半角文字 "S" からなる長さ W の文字列 s_i が与えられます。
    // s_i の j 番目 (1 ≦ j ≦ W) の文字は i 行 j 列のグリッドの状態を表し、
    // "#" はその場所が柱であることを、
    // "." はその場所が自由に行き来できることを、
    // "S" はその場所に最初にあなたがいることを表します ("S" の場所は自由に行き来出来ます)
    // 文字列は標準入力から渡されます。
    const grid = lines.slice(1, meiroRow + 1);
    // console.log({ grid });

    // gridの中身を２次元配列に変換
    const grid2 = grid.map((row) => row.split(''));
    // console.log("入力:", { grid2 });

    // grid2からSが含まれる行と列を取得
    const sStartRow = grid2.findIndex((row) => row.includes('S'));
    const sStartCol = grid2[sStartRow].findIndex((col) => col === 'S');
    // console.log("初期位置:", { sStartRow }, { sStartCol });

    // Row,Colを引数に取り、H,Wの淵かどうかを判定
    const isEdge = (row, col) => {
        return row === 0 || row === meiroRow - 1 || col === 0 || col === meiroCol - 1;
    };


    // main処理
    const main = (grid2) => {
    // grid2からSが含まれる行と列を取得
    const sNowRow = grid2.findIndex((row) => row.includes('S'));
    const sNowCol = grid2[sNowRow].findIndex((col) => col === 'S');
    // console.log("現在位置:", { sNowRow }, { sNowCol });

        // 今いる場所が淵ならばYESを返す
        if (isEdge(sNowRow, sNowCol)) {
            return 'YES';
        }

        // 今いる場所を#に変更
        grid2[sNowRow][sNowCol] = '#';

        // 今いる場所の上下左右を取得
        const up = grid2[sNowRow - 1][sNowCol];
        const down = grid2[sNowRow + 1][sNowCol];
        const left = grid2[sNowRow][sNowCol - 1];
        const right = grid2[sNowRow][sNowCol + 1];
        // console.log({ up }, { down }, { left }, { right });

        // 今いる場所の上下左右が.ならばmainを再帰
        if (up === '.') {
            grid2[sNowRow - 1][sNowCol] = 'S';
            //console.log({ grid2 });
            // 0.1秒待機
            const sleep = waitTime => new Promise( resolve => setTimeout(resolve, 100) );
            if (main(grid2) === 'YES') {
                return 'YES';
            }
        }
        if (down === '.') {
            grid2[sNowRow + 1][sNowCol] = 'S';
            //console.log({ grid2 });
            // 0.1秒待機
            const sleep = waitTime => new Promise( resolve => setTimeout(resolve, 100) );
            if (main(grid2) === 'YES') {
                return 'YES';
            }
        }
        if (left === '.') {
            grid2[sNowRow][sNowCol - 1] = 'S';
            //console.log({ grid2 });
            // 0.1秒待機
            const sleep = waitTime => new Promise( resolve => setTimeout(resolve, 100) );
            if (main(grid2) === 'YES') {
                return 'YES';
            }
        }
        if (right === '.') {
            grid2[sNowRow][sNowCol + 1] = 'S';
            //console.log({ grid2 });
            // 0.1秒待機
            const sleep = waitTime => new Promise( resolve => setTimeout(resolve, 100) );
            if (main(grid2) === 'YES') {
                return 'YES';
            }
        }

        // 全部の探索が終わったらNOを返す
        return 'NO';
    }

    // main実行
    console.log(main(grid2));

});
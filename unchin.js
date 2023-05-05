process.stdin.resume();
process.stdin.setEncoding('utf8');
// 自分の得意な言語で
// Let's チャレンジ！！
const shintyo = 170;
var lines = [];
var reader = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
reader.on('line', (line) => {
    lines.push(line);
});

reader.on('close', () => {
    // 1行目にN M の２つの数字が入力されるので、２次元配列を用意する。
    // 2行目以降にN行M列の数字が入力されるので、２次元配列「運賃」に格納する。
    // 2次元配列の中身を出力する。
    const [N, M] = lines[0].split(' ').map(Number);
    const fee = [];
    for (let i = 1; i <= N; i++) {
        fee.push(lines[i].split(' ').map(Number));
    }
    // console.log({ fee });


    // 1 + N + 1 行目に計算のループ回数を表す整数Xが入力されるので、変数Xを用意する。
    // 2 + N + 1 行目にO P の２つの数字が入力されるので、２次元配列「移動ルート」を用意する。
    // X回ループを回す。
    const X = Number(lines[1 + N]);
    const route = [];
    for (let i = 1 + N + 1; i <= 1 + N + X; i++) {
        route.push(lines[i].split(' ').map(Number));
    }
    // console.log({ route });

    let eki_goal,eki_start,rosen,total = 0;
    for (let i = 0; i < X; i++) {
        // i=0のとき、fee[0,route[0,1]] となる。
        if (i === 0) {
            rosen = route[i][0] - 1;
            eki_goal = route[0][1] - 1;
            total = fee[rosen][eki_goal];
        } else {
            eki_start = route[i-1][1] - 1;
            eki_goal = route[i][1] - 1;
            rosen = route[i][0] - 1;
            // fee[rosen][eki] - fee[rosen][eki]の絶対値をtotalに足す。
            total = total + Math.abs(fee[rosen][eki_goal] - fee[rosen][eki_start]);
        }
        // console.log({eki_start},{eki_goal},{rosen},{total});
    }

        console.log(total);
});


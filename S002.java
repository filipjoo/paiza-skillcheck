import java.util.*;
// 幅優先探索
class Main {
  final static int[] dx = {1, 0, -1, 0};
  final static int[] dy = {0, -1, 0, 1};
  final static int R = 0, U = 1, L = 2, D = 3;
  static class State {
    int x, y;
    State(int x, int y) {
      this.x = x;
      this.y = y;
    }
    @Override public int hashCode() {
      return (x << 16) | y;
    }
    @Override public boolean equals(Object other) {
      State that = (State)other;
      return this.x == that.x && this.y == that.y;
    }
  }
  static int bfs(int h, int w, int[][] t, int sx, int sy, int gx, int gy) {
    LinkedList<State> open = new LinkedList<>();
    Set<State> closed = new HashSet<>();
    State initialState = new State(sx, sy);
    open.add(initialState);
    int cost = 1;
    while (true) {
      LinkedList<State> tmpQ = new LinkedList<>();
      while (!open.isEmpty()) {
        State st = open.poll();
        if (st.x == gx && st.y == gy)
          return cost;
        if (t[st.y][st.x] == 1)
          continue;
        if (closed.contains(st))
          continue;
        closed.add(st);
        for (int i=0; i<4; i++) {
          int nx = st.x + dx[i];
          int ny = st.y + dy[i];
          if (!(0 <= nx && nx < w && 0 <= ny && ny < h))
            continue;
          tmpQ.add(new State(nx, ny));
        }
      }
      open = tmpQ;
      cost ++;
    }
  }
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int h = sc.nextInt();
    int w = sc.nextInt();
    int[][] t = new int[h][w];
    for (int i=0; i<h; i++)
      for (int j=0; j<w; j++)
        t[i][j] = sc.nextInt();
    int cost = bfs(h, w, t, 0, 0, w-1, h-1);
    System.out.println(cost);
  }
}

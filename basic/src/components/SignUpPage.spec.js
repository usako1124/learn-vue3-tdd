import SignUpPage from "./SignUpPage.vue";
import {
  describe,
  it,
  expect,
  afterEach,
  vi,
  beforeEach,
  afterAll,
  beforeAll,
} from "vitest";
import { render, cleanup, fireEvent, screen } from "@testing-library/vue";
import axios from "axios";
import { rest } from "msw";
import { setupServer } from "msw/node";

describe("SignUpPage", () => {
  beforeEach(() => {
    render(SignUpPage);
  });
  afterEach(cleanup);

  describe("レイアウト", () => {
    it("Sign Up ヘッダーが表示される", () => {
      const actual = screen.getByRole("heading", { name: "Sign Up" });
      const expected = true;
      expect(actual).toBeTruthy(expected);
    });

    it("ユーザー名の入力フォームが表示される", () => {
      const actual = screen.queryByLabelText("ユーザー名");
      const expected = true;
      expect(actual).toBeTruthy(expected);
    });

    it("Eメールの入力フォームが表示される", () => {
      const actual = screen.queryByLabelText("メールアドレス");
      const expected = true;
      expect(actual).toBeTruthy(expected);
    });

    it("パスワードの入力フォームが表示される", () => {
      const actual = screen.queryByLabelText("パスワード");
      const expected = true;
      expect(actual).toBeTruthy(expected);
    });

    it("パスワード（確認用）の入力フォームが表示される", () => {
      const actual = screen.queryByLabelText("パスワード（確認用）");
      const expected = true;
      expect(actual).toBeTruthy(expected);
    });

    it("パスワードの入力フォームの type が password であること", () => {
      const actual = screen.queryByLabelText("パスワード").type;
      const expected = "password";
      expect(actual).toBe(expected);
    });

    it("パスワード（確認用）の入力フォームの type が password であること", () => {
      const actual = screen.queryByLabelText("パスワード（確認用）").type;
      const expected = "password";
      expect(actual).toBe(expected);
    });

    it("登録ボタンが表示される", () => {
      const actual = screen.getByRole("button", { name: "登録" });
      expect(actual).toBeTruthy();
    });

    it("登録ボタンが初期表示時は disabled となっている", () => {
      const actual = screen.getByRole("button", { name: "登録" }).disabled;
      expect(actual).toBeTruthy();
    });
  });

  describe("インタラクション", () => {
    let requestBody;
    const server = setupServer(
      rest.post("/api/v1/users", async (req, res, ctx) => {
        requestBody = await req.json();
        if (requestBody.username === "Error1") {
          return res(
            ctx.status(500),
            ctx.json({
              error: {
                message: "サーバーエラーです。時間を置いて試してください。",
              },
            })
          );
        }
        return res(ctx.status(200));
      })
    );

    beforeAll(() => server.listen());
    afterAll(() => server.close());

    const fillAllForm = async (username, email, password, passwordCheck) => {
      const usernameInput = screen.getByLabelText("ユーザー名");
      const emailInput = screen.queryByLabelText("メールアドレス");
      const passwordInput = screen.queryByLabelText("パスワード");
      const passwordCheckInput =
        screen.queryByLabelText("パスワード（確認用）");
      await fireEvent.update(usernameInput, username);
      await fireEvent.update(emailInput, email);
      await fireEvent.update(passwordInput, password);
      await fireEvent.update(passwordCheckInput, passwordCheck);
    };

    const responseServerCheck = async (username) => {
      await fillAllForm(
        username,
        "usako@example.com",
        "hogehogehoge",
        "hogehogehoge"
      );
      const button = screen.getByRole("button", { name: "登録" });
      await fireEvent.click(button);
    };

    it("全フォーム入力済み、かつパスワードとパスワードの値が同じ値の場合、登録の disabled が解除される", async () => {
      await fillAllForm(
        "usako",
        "usako@example.com",
        "hogehogehoge",
        "hogehogehoge"
      );

      const actual = screen.getByRole("button", { name: "登録" }).disabled;
      const expected = false;

      expect(actual).toBe(expected);
    });

    it("全フォーム入力済みでも、パスワードが不一致の場合、登録ボタンが disabled になる", async () => {
      await fillAllForm(
        "usako",
        "usako@example.com",
        "hogehogehoge",
        "hugahuga"
      );

      const actual = screen.getByRole("button", { name: "登録" }).disabled;
      const expected = true;

      expect(actual).toBe(expected);
    });

    it("登録ボタンを押下した場合、ユーザー名、メールアドレス、パスワードをサーバーに送信（axios）", async () => {
      await fillAllForm(
        "usako",
        "usako@example.com",
        "hogehogehoge",
        "hogehogehoge"
      );
      const button = screen.getByRole("button", { name: "登録" });
      const mockFn = vi.fn();
      const axiosFn = axios.post;

      axios.post = mockFn;
      await fireEvent.click(button);
      // MEMO: 初期化してあげないと移行の SMW でエラーになる
      axios.post = axiosFn;

      const firstCall = mockFn.mock.calls.at(0);
      const actual = firstCall.at(1);

      const expected = {
        username: "usako",
        email: "usako@example.com",
        password: "hogehogehoge",
      };

      expect(actual).toEqual(expected);
    });

    it("登録ボタンを押下した場合、ユーザー名、メールアドレス、パスワードをサーバーに送信（MSW）", async () => {
      await responseServerCheck("usako");
      const actual = requestBody;
      const expected = {
        username: "usako",
        email: "usako@example.com",
        password: "hogehogehoge",
      };

      expect(actual).toEqual(expected);
    });

    it("登録時にサーバーからエラーが返された場合、エラーメッセージを表示", async () => {
      await responseServerCheck("Error1");
      const actual = await screen.findByText(
        "サーバーエラーです。時間を置いて試してください。"
      );

      expect(actual).toBeTruthy();
    });
  });
});

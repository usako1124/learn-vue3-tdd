import SignUpPage from "./SignUpPage.vue";
import { describe, it, expect, afterEach, vi } from "vitest";
import { render, cleanup, fireEvent, screen } from "@testing-library/vue";
import axios from "axios";
import { rest } from "msw";
import { setupServer } from "msw/node";

describe("SignUpPage", () => {
  afterEach(cleanup);

  describe("レイアウト", () => {
    it("Sign Up ヘッダーが表示される", () => {
      const wrapper = render(SignUpPage);
      const actual = wrapper.getByRole("heading", { name: "Sign Up" });
      const expected = true;
      expect(actual).toBeTruthy(expected);
    });

    it("ユーザー名の入力フォームが表示される", () => {
      const wrapper = render(SignUpPage);
      const actual = wrapper.queryByLabelText("ユーザー名");
      const expected = true;
      expect(actual).toBeTruthy(expected);
    });

    it("Eメールの入力フォームが表示される", () => {
      const wrapper = render(SignUpPage);
      const actual = wrapper.queryByLabelText("メールアドレス");
      const expected = true;
      expect(actual).toBeTruthy(expected);
    });

    it("パスワードの入力フォームが表示される", () => {
      const wrapper = render(SignUpPage);
      const actual = wrapper.queryByLabelText("パスワード");
      const expected = true;
      expect(actual).toBeTruthy(expected);
    });

    it("パスワード（確認用）の入力フォームが表示される", () => {
      const wrapper = render(SignUpPage);
      const actual = wrapper.queryByLabelText("パスワード（確認用）");
      const expected = true;
      expect(actual).toBeTruthy(expected);
    });

    it("パスワードの入力フォームの type が password であること", () => {
      const wrapper = render(SignUpPage);
      const actual = wrapper.queryByLabelText("パスワード").type;
      const expected = "password";
      expect(actual).toBe(expected);
    });

    it("パスワード（確認用）の入力フォームの type が password であること", () => {
      const wrapper = render(SignUpPage);
      const actual = wrapper.queryByLabelText("パスワード（確認用）").type;
      const expected = "password";
      expect(actual).toBe(expected);
    });

    it("登録ボタンが表示される", () => {
      const wrapper = render(SignUpPage);
      const actual = wrapper.getByRole("button", { name: "登録" });
      expect(actual).toBeTruthy();
    });

    it("登録ボタンが初期表示時は disabled となっている", () => {
      const wrapper = render(SignUpPage);
      const actual = wrapper.getByRole("button", { name: "登録" }).disabled;
      expect(actual).toBeTruthy();
    });
  });

  describe("インタラクション", () => {
    it("全フォーム入力済み、かつパスワードとパスワードの値が同じ値の場合、登録の disabled が解除される", async () => {
      render(SignUpPage);
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
      render(SignUpPage);
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

    // it("登録ボタンを押下した場合、ユーザー名、メールアドレス、パスワードをサーバーに送信（axios）", async () => {
    //   render(SignUpPage);
    //   await fillAllForm(
    //     "usako",
    //     "usako@example.com",
    //     "hogehogehoge",
    //     "hogehogehoge"
    //   );
    //   const button = screen.getByRole("button", { name: "登録" });
    //   const mockFn = vi.fn();

    //   axios.post = mockFn;
    //   await fireEvent.click(button);

    //   const firstCall = mockFn.mock.calls.at(0);
    //   const actual = firstCall.at(1);

    //   const expected = {
    //     username: "usako",
    //     email: "usako@example.com",
    //     password: "hogehogehoge",
    //   };

    //   expect(actual).toEqual(expected);
    // });

    it("登録ボタンを押下した場合、ユーザー名、メールアドレス、パスワードをサーバーに送信（MSW）", async () => {
      let requestBody;

      const server = setupServer(
        rest.post("/api/v1/users", async (req, res, ctx) => {
          requestBody = await req.json();
          return res(ctx.status(200));
        })
      );
      server.listen();

      render(SignUpPage);
      await fillAllForm(
        "usako",
        "usako@example.com",
        "hogehogehoge",
        "hogehogehoge"
      );

      const button = screen.getByRole("button", { name: "登録" });
      await fireEvent.click(button);
      console.log("クリックされたよ");
      await server.close();

      const actual = requestBody;
      const expected = {
        username: "usako",
        email: "usako@example.com",
        password: "hogehogehoge",
      };

      expect(actual).toEqual(expected);
    });

    it("登録時にサーバーからエラーが返された場合、エラーメッセージを表示", async () => {
      const server = setupServer(
        rest.post("/api/v1/users", async (req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({
              error: {
                message: "サーバーエラーです。時間を置いて試してください。",
              },
            })
          );
        })
      );
      server.listen();

      render(SignUpPage);
      await fillAllForm(
        "usako",
        "usako@example.com",
        "hogehogehoge",
        "hogehogehoge"
      );

      const button = screen.getByRole("button", { name: "登録" });
      await fireEvent.click(button);
      await server.close();

      const actual = await screen.findByText(
        "サーバーエラーです。時間を置いて試してください。"
      );

      expect(actual).toBeTruthy();
    });

    async function fillAllForm(username, email, password, passwordCheck) {
      const usernameInput = screen.getByLabelText("ユーザー名");
      const emailInput = screen.queryByLabelText("メールアドレス");
      const passwordInput = screen.queryByLabelText("パスワード");
      const passwordCheckInput =
        screen.queryByLabelText("パスワード（確認用）");
      await fireEvent.update(usernameInput, username);
      await fireEvent.update(emailInput, email);
      await fireEvent.update(passwordInput, password);
      await fireEvent.update(passwordCheckInput, passwordCheck);
    }
  });
});

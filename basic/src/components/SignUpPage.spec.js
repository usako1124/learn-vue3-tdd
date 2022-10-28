import SignUpPage from "./SignUpPage.vue";
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup, fireEvent } from "@testing-library/vue";

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
      const wrapper = render(SignUpPage);
      const usernameInput = wrapper.getByLabelText("ユーザー名");
      const emailInput = wrapper.queryByLabelText("メールアドレス");
      const passwordInput = wrapper.queryByLabelText("パスワード");
      const passwordCheckInput =
        wrapper.queryByLabelText("パスワード（確認用）");
      await fireEvent.update(usernameInput, "usako");
      await fireEvent.update(emailInput, "usako@example.com");
      await fireEvent.update(passwordInput, "hogehogehoge");
      await fireEvent.update(passwordCheckInput, "hogehogehoge");
      const actual = wrapper.getByRole("button", { name: "登録" }).disabled;

      const expected = false;

      expect(actual).toBe(expected);
    });
  });
});

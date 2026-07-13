import DocPage from "../components/DocPage";
import { CONTACT_EMAIL } from "../lib/site";

export default function Privacy() {
  return (
    <DocPage
      title="プライバシーポリシー"
      description="北摂マルシェのプライバシーポリシー。Cookieの利用、Google AdSenseによる広告配信、アクセス解析、個人情報の取り扱いについて記載しています。"
      path="/privacy"
    >
      <p>
        当サイト「北摂マルシェ」（以下「当サイト」）における個人情報・Cookie等の取り扱いについて、
        以下のとおり定めます。
      </p>

      <h2>1. 個人情報の取得について</h2>
      <p>
        当サイトは会員登録やログインの機能を持たず、氏名・住所・電話番号などの個人情報を
        入力・送信していただく仕組みはありません。お気に入りや表示設定は、お使いの端末内
        （ブラウザのローカルストレージ）にのみ保存され、当サイトのサーバーへは送信されません。
      </p>

      <h2>2. Cookie（クッキー）の利用について</h2>
      <p>
        当サイトでは、広告配信およびアクセス状況の把握のためにCookieを利用することがあります。
        Cookieは、ブラウザの設定により無効にすることができます。無効にした場合でも、当サイトの
        基本的な機能はご利用いただけます。
      </p>

      <h2>3. 広告配信（Google AdSense）について</h2>
      <p>
        当サイトは、第三者配信の広告サービス「Google AdSense」を利用する場合があります。
        Googleなどの第三者広告配信事業者は、ユーザーの興味に応じた広告を表示するために
        Cookieを使用することがあります。
      </p>
      <ul>
        <li>
          Googleがどのようにデータを収集・使用するかは、
          <a
            href="https://policies.google.com/technologies/ads?hl=ja"
            target="_blank"
            rel="noopener noreferrer"
          >
            「広告 – ポリシーと規約 – Google」
          </a>
          をご覧ください。
        </li>
        <li>
          ユーザーは、
          <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer">
            Googleの広告設定
          </a>
          からパーソナライズ広告を無効にできます。
        </li>
        <li>
          その他の第三者配信事業者の広告を無効にする方法については、
          <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer">
            aboutads.info
          </a>
          をご参照ください。
        </li>
      </ul>

      <h2>4. アクセス解析について</h2>
      <p>
        当サイトでは、利用状況を把握するためにアクセス解析ツールを利用する場合があります。
        これらのツールはCookie等を使用して情報を収集しますが、個人を特定する情報は含まれません。
      </p>

      <h2>5. 免責事項</h2>
      <p>
        当サイトに掲載する価格・セール情報は、各店舗が公開するチラシをもとにAIが自動集計した
        参考情報です。内容の正確性・最新性・在庫状況を保証するものではなく、これらの情報を
        利用して生じたいかなる損害についても責任を負いかねます。ご購入前に各店舗の公式情報を
        必ずご確認ください。
      </p>
      <p>当サイトからリンクする外部サイトの内容については、当サイトは責任を負いません。</p>

      <h2>6. プライバシーポリシーの変更</h2>
      <p>
        本ポリシーの内容は、法令やサービス内容の変更に応じて予告なく変更することがあります。
        変更後の内容は、当サイトに掲載した時点から効力を生じます。
      </p>

      <h2>7. お問い合わせ</h2>
      <p>
        本ポリシーに関するお問い合わせは、
        {CONTACT_EMAIL ? (
          <>
            {" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>{" "}
          </>
        ) : (
          "運営者情報ページに記載の連絡先"
        )}
        までお願いいたします。
      </p>
    </DocPage>
  );
}

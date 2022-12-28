'use strict';

{
  // 　callback ですが、ここで設定した域値を越えて表示されたり、表示されなくなったりしたすべての要素の情報を引数で受け取ることができるので entries で受け取り,
  // 　entries は複数の要素なので forEach を使って、個々の要素を entry として次の処理をしてねと書く。
  // 　entry の isIntersecting で調べて、それが false だった場合、つまり画面にまだ表示されていなかったり、スクロールして要素が消えていくときには何もする必要がないので return; として処理をここで止め,
  // それ以外の場合、つまり画面に要素が現れたときには appear クラスをつければいいのですが、交差した要素は entry.target で取得できるので、 classList.add('appear'); と書けばいい
  function inViewCallback(entries, obs) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      }
      entry.target.classList.add('appear');
      obs.unobserve(entry.target);
    });
  }

// 交差した要素の情報は entries で受け取ることができます。今回は一つしか監視していないのですが、 entries は配列で渡されるので forEach で処理していきます。個々の要素を enrty として、次の処理をしてねと書きます。entry の isIntersecting で空要素が画面と交差したかを調べるのですが、ここで交差していなかったら空要素が画面から消えていて、それは少しでもスクロールしたことを意味するので、こちらでヘッダーに scrolled クラスを付けましょう。
  function onScrollCallback(entries) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        header.classList.add('scrolled');
        toTop.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
        toTop.classList.remove('scrolled');
      }
    });
  }

const header = document.querySelector('header');
const toTop = document.getElementById('to_top');

// 特定の要素が画面に 20% くらい交差したときにこちらの inViewCallback の処理を実行してくれる
  const inViewObserver = new IntersectionObserver(inViewCallback, {
    threshold: 0.2,
  });
// inViewObserver を使って、 animate クラスを付けた要素を監視する。document.querySelectorAll を使えば、複数の要素を取得できるので、 animate クラスを付けた要素を取得して、 forEach で処理。個々の要素を el として inViewObserver のメソッドを使って監視
  document.querySelectorAll('.animate').forEach(el => {
    inViewObserver.observe(el);
  });

// observer を使って、先ほどの空要素を監視すればいいので observe メソッドを使って、空要素を指定するには id を付けたので getElementById を使えば良いでしょう
  const onScrollObserver = new IntersectionObserver(onScrollCallback);
  onScrollObserver.observe(document.getElementById('target'));


// addEventListener としてクリックしたときに、イベントオブジェクトを受け取って、 preventDefault を使うことにより URL 末尾にパウンド記号が付かないようにすることができます。ただ、これだけだと上にも戻らなくなるので window.scrollTo と言う命令を使って戻る位置をオブジェクトで指定します。
// 一番上まで戻りたいので、 top: 0, とすれば良いですね。
// あとは上に戻るときにスムーズにスクロールさせてみます。window.scrollTo に対してオプションを指定します。behavior: 'smooth', とすれば OK です。
  toTop.addEventListener('click', e => {
    e.preventDefault();

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

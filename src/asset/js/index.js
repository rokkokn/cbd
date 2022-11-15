jQuery(function() {
/*
 * 固定ボタンの表示非表示切替
 */
  var form = $('.js-formArea').innerHeight(); // formの高さを取得
  
  window.onscroll = function () {
    var point = window.pageYOffset; // 現在のスクロール地点 
    var docHeight = $(document).height(); // ドキュメントの高さ
    var dispHeight = $(window).height(); // 表示領域の高さ
  
    if(point > docHeight-dispHeight/1.5-form){ // スクロール地点>ドキュメントの高さ-表示領域-formの高さ
      $('.js-floatingNav').addClass('is-hidden'); //formより下にスクロールしたらis-hiddenを追加
      // $('.js-required_field_exists').addClass('is-show');
    }else{
      $('.js-floatingNav').removeClass('is-hidden'); //formより上にスクロールしたらis-hiddenを削除
      // $('.js-required_field_exists').removeClass('is-show');

    }
  };





  });



  document.addEventListener("DOMContentLoaded", () => {
    setUpAccordion();
  });
  
  /**
   * ブラウザの標準機能(Web Animations API)を使ってアコーディオンのアニメーションを制御します
   */
  const setUpAccordion = () => {
    const details = document.querySelectorAll(".js-details");
    const RUNNING_VALUE = "running"; // アニメーション実行中のときに付与する予定のカスタムデータ属性の値
    const IS_OPENED_CLASS = "is-opened"; // アイコン操作用のクラス名
  
    details.forEach((element) => {
      const summary = element.querySelector(".js-summary");
      const content = element.querySelector(".js-faqListtexContainer");
  
      summary.addEventListener("click", (event) => {
        // デフォルトの挙動を無効化
        event.preventDefault();
  
        // 連打防止用。アニメーション中だったらクリックイベントを受け付けないでリターンする
        if (element.dataset.animStatus === RUNNING_VALUE) {
          return;
        }
  
        // detailsのopen属性を判定
        if (element.open) {
          // アコーディオンを閉じるときの処理
          // アイコン操作用クラスを切り替える(クラスを取り除く)
          element.classList.toggle(IS_OPENED_CLASS);
  
          // アニメーションを実行
          const closingAnim = content.animate(closingAnimKeyframes(content), animTiming);
          // アニメーション実行中用の値を付与
          element.dataset.animStatus = RUNNING_VALUE;
  
          // アニメーションの完了後に
          closingAnim.onfinish = () => {
            // open属性を取り除く
            element.removeAttribute("open");
            // アニメーション実行中用の値を取り除く
            element.dataset.animStatus = "";
          };
        } else {
          // アコーディオンを開くときの処理
          // open属性を付与
          element.setAttribute("open", "true");
  
          // アイコン操作用クラスを切り替える(クラスを付与)
          element.classList.toggle(IS_OPENED_CLASS);
  
          // アニメーションを実行
          const openingAnim = content.animate(openingAnimKeyframes(content), animTiming);
          // アニメーション実行中用の値を入れる
          element.dataset.animStatus = RUNNING_VALUE;
  
          // アニメーション完了後にアニメーション実行中用の値を取り除く
          openingAnim.onfinish = () => {
            element.dataset.animStatus = "";
          };
        }
      });
    });
  }
  
  /**
   * アニメーションの時間とイージング
   */
  const animTiming = {
    duration: 400,
    easing: "ease-out"
  };
  
  /**
   * アコーディオンを閉じるときのキーフレーム
   */
  const closingAnimKeyframes = (content) => [
    {
      height: content.offsetHeight + 'px', // height: "auto"だとうまく計算されないため要素の高さを指定する
      opacity: 1,
    }, {
      height: 0,
      opacity: 0,
    }
  ];
  
  /**
   * アコーディオンを開くときのキーフレーム
   */
  const openingAnimKeyframes = (content) => [
    {
      height: 0,
      opacity: 0,
    }, {
      height: content.offsetHeight + 'px',
      opacity: 1,
    }
  ];




  /**
   * カルーセル
   * 
   * 
   * 
   * 
   */
  const keenSlider = new KeenSlider(".keen-slider", {
    loop: true,
    created: (instance) => { // 初めて初期化された後に実行
      // 左の矢印ボタンをクリックしたら1つ前のスライドに移動
      document
        .getElementById("arrow-left")
        .addEventListener("click", () => {
          instance.prev();
        });

      // 右の矢印ボタンをクリックしたら1つ先のスライドに移動
      document
        .getElementById("arrow-right")
        .addEventListener("click", () => {
          instance.next();
        });

      // ドットインジケーターを生成する親要素を取得
      const dots_wrapper = document.getElementById("dots");

      // スライドと同じ数のドットインジケーターを生成
      const slides = document.querySelectorAll(".keen-slider__slide");
      slides.forEach((t, idx) => {
        const dot = document.createElement("button");
        dot.classList.add("dot");
        dots_wrapper.appendChild(dot);

        // ドットインジケーターをクリックしたら同じインデックスのスライドへ移動
        dot.addEventListener("click", () => {
          instance.moveToSlide(idx);
        });
      });

      // CSSクラスの更新
      updateClasses(instance);
    },
    slideChanged: (instance) => { // 現在表示されているスライドが変更された時に実行
      // CSSクラスの更新
      updateClasses(instance);
    },
  })

  /**
   * 各要素のCSSクラスを更新
   * @param instance
   */
  function updateClasses(instance) {
    // 現在表示しているスライドの列番号を取得
    const slide = instance.details().relativeSlide;

    // 前後にスライドする矢印ボタンの状態を更新
    const arrowLeft = document.getElementById("arrow-left");
    const arrowRight = document.getElementById("arrow-right");
    slide === 0 // 最初のスライドの場合
      ? arrowLeft.classList.add("arrow--disabled")
      : arrowLeft.classList.remove("arrow--disabled");
    slide === instance.details().size - 1 // 最後のスライドの場合
      ? arrowRight.classList.add("arrow--disabled")
      : arrowRight.classList.remove("arrow--disabled");

    // 生成されたドットインジケーターの要素を取得し状態を更新
    const dots = document.querySelectorAll(".dot");
    dots.forEach((dot, idx) => {
      idx === slide
        ? dot.classList.add("dot--active")
        : dot.classList.remove("dot--active");
    })
  }
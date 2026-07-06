const fs = require("fs");
const path = require("path");

const outPath = path.join(__dirname, "..", "assets", "js", "hardcoded-post.js");

const content = `const HardcodedPost = {
  title: "휴대폰 저렴하게 구매하는 방법! 인천 휴대폰 성지 방문기",

  images: {
    storeLogo: "https://postfiles.pstatic.net/MjAyNjA2MjlfNzAg/MDAxNzgyNzEyNDc1NzU2.7i2ZG2Ply0JE-gvfQaH01HC-lETD0wFKQtGbKpIk_d8g.9lFurot37EjLOz6y1WtL8TilfoDdfJQnix9gnkxIse0g.PNG/%ED%9C%B4%EB%8C%80%ED%8F%B0_%EC%84%B1%EC%A7%80_%EC%98%86%EC%BB%A4%ED%8F%B0%EB%B6%80%EA%B0%9C%EC%A0%90.png?type=w773",
    certificate: "https://postfiles.pstatic.net/MjAyNjA2MjlfMjAw/MDAxNzgyNzEyNzkzODQ0.UsDVgaA92B1zYKbXoKBYHMS8UwTcTbfSopA8Qj_Fu8cg.JRNF69HQy-aWlVSBawVCteLAztwOquzfYNIU6t9zffsg.JPEG/900_20260629_133407.jpg?type=w773",
    exteriorWide: "https://postfiles.pstatic.net/MjAyNjA2MjlfOSAg/MDAxNzgyNzEyNDc1ODc4.dYZt8IM3cQIZwu5YPzltOS1403wFtNtDqtbVm9O3htkg.S1GTnqVxLGAng6CRV18Fk9qL-liLXCxts9x1AvuSMaEg.JPEG/900_1782712418843.jpg?type=w773",
    exteriorDoor: "https://postfiles.pstatic.net/MjAyNjA2MjlfMjQy/MDAxNzgyNzEyNDc1ODc4.IYAhFj-JO2oXMA1Ysh09m07W6rFZM-QUvk9_3aHFf74g.EFEppaSUZE7Udi3byq5Bndves7A__Au6wQ7vNgl2jyIg.JPEG/900_20260629_133157.jpg?type=w773",
    mapStatic: "https://simg.pstatic.net/static.map/v2/map/staticmap.bin?caller=smarteditor&markers=size%3Amid%7Ccolor%3A0x11cc73%7Ctype%3Ad%7CviewSizeRatio%3A0.7%7Cpos%3A126.733507%2037.489695&w=892&h=433&center=126.7335074%2C37.4896946&level=17&scale=2&dataversion=178.10",
    stickerHello: "https://storep-phinf.pstatic.net/ogq_6483daec1ba38/original_2.png?type=p100_100",
    stickerBye: "https://storep-phinf.pstatic.net/ogq_6483daec1ba38/original_23.png?type=p100_100",
    collageInterior: [
      "https://postfiles.pstatic.net/MjAyNjA2MjlfMTAy/MDAxNzgyNzEyNzk0MDA2.gzDjV6tW3yHH2_v51MeLp23X0TSdw-AmF4VgGgkaMd8g.RV2tGzJXxGi9LlRncnLlt_ZzBF7w856aUZkLJRa2CyMg.JPEG/900_20260629_133221.jpg?type=w386",
      "https://postfiles.pstatic.net/MjAyNjA2MjlfMjA1/MDAxNzgyNzEyNzk1NzEx.DEuqnKSwN_iPqBZpd0aJA-CvLE2D_F3fA-_wTOw9Btsg._J58QHaRSyff9ZGmM3qOxJAyHGD80b4XyEz-5hzfGTAg.JPEG/900_20260629_133223.jpg?type=w386",
      "https://postfiles.pstatic.net/MjAyNjA2MjlfMTEz/MDAxNzgyNzEyNzk3MjUy.60O7F8CyNqsEfVAaw9M_YYL0iF96L7iiPd2E1r3CmUgg.4GEuZCxPsqSCFkcWUDiL0WRT1PyYYypli4KzrpFsv_Eg.JPEG/900_20260629_133242.jpg?type=w386",
      "https://postfiles.pstatic.net/MjAyNjA2MjlfMjg2/MDAxNzgyNzEyNzk4NjY5.gKMjy0Zc_FlC1K_z_LWDny2gg1DZpx94_2-WOVDiFQ0g.kDOuzPJij1wwQoHmJe4xYPATkEBoh1yUbq6CvhDKiXgg.JPEG/900_20260629_133249.jpg?type=w773"
    ],
    collageConsult: [
      "https://postfiles.pstatic.net/MjAyNjA2MjlfMTYg/MDAxNzgyNzEzNDk5MTIx.mEFTxXvF4vbJbNikLqScQnE1Kfhv56VJp0ft4bFyrYMg.8sqQtYNeGbF8WXEHfU3JxQ6Q49nSXUuqd90WOq6Y8G0g.JPEG/900_20260629_133309.jpg?type=w386",
      "https://postfiles.pstatic.net/MjAyNjA2MjlfOSAg/MDAxNzgyNzEzNTAwODU4.hy395ME2KV0M2hjxjBAiUe4Wfrp5o9qrLGyZPRF2crUg.3wLAS0FMLZ0VsShtjQjqnbTMCzdTMjiq_3DSN18Xe7Ag.JPEG/900_20260629_133306.jpg?type=w386",
      "https://postfiles.pstatic.net/MjAyNjA2MjlfMyAg/MDAxNzgyNzEzNTAyMjMz.uiZ-zY36V0soVuEvuS_4k0iOu6QUn_lRDeLSYzS8incg.bV0mkcrEKpJS8XTpMCHGs3JZcTUiNp2atfhiymeiB4wg.JPEG/900_20260629_133447.jpg?type=w386",
      "https://postfiles.pstatic.net/MjAyNjA2MjlfMTA3/MDAxNzgyNzEzNTAzNDU0.oWZTQkBJBtsBnEmYW4qtJHRaeJ1jTT2BcBjIpEIB6PMg.3hOkSjGLP7tIqi2IsEHwFhtEpo-QmnXBAfW-BrIkBr4g.JPEG/900_20260629_133456.jpg?type=w386"
    ],
    collageRecommend: [
      "https://postfiles.pstatic.net/MjAyNjA2MjlfMjU2/MDAxNzgyNzEzNDk5MDkz.H8BkZp-sVwW4f2CamkKg0FgKz18sg1UsxpVB5Cphzwcg.R5jDmy-ZCCuS2Xn1tkIaW0U-djcy77BRXYxJqzAYprUg.JPEG/900_20260629_133512.jpg?type=w386",
      "https://postfiles.pstatic.net/MjAyNjA2MjlfMTcg/MDAxNzgyNzEzNTAwNTI1.x3LjP3c0dU9ZBDUqqojG9uWVsM8IQmzA7pSlztlGpDAg.04eneFYUbXQak8e-FcMDk4nyjTu-C1mIERou8C4M3Aog.JPEG/900_20260629_133514.jpg?type=w386",
      "https://postfiles.pstatic.net/MjAyNjA2MjlfMjY1/MDAxNzgyNzEzNTAyMDI1.Ad752qYPqF7DdU-yYa2mo1fY5lb-Or8Yvj8FV68Wvn8g.2jM2whNI1Mg69r3-TgAd99pYZSuFx9N_BEwZbRgky_sg.JPEG/900_20260629_133517.jpg?type=w386",
      "https://postfiles.pstatic.net/MjAyNjA2MjlfMjAg/MDAxNzgyNzEzNTAzNTU1.orDMTW1urfNq2H2xsClmHFxIvUzpNWK9_IphzffntGsg.UrKyCk96YG5jYjpAm4EN97aNgl_WJc8Lt23Rk24ODRIg.JPEG/900_20260629_133519.jpg?type=w386"
    ],
    collageAward: [
      "https://postfiles.pstatic.net/MjAyNjA2MjlfMjY2/MDAxNzgyNzEzNTA0NDc3.epOfpyRWJmjynQz46fWba_CpPsyM_zvK-x0k2w9c-Igg.VEBdpGgA3dEvhKr8DVhqcPp4fBT3zUvymqAcDDpB_84g.JPEG/900_20260629_133522.jpg?type=w386",
      "https://postfiles.pstatic.net/MjAyNjA2MjlfMTQ0/MDAxNzgyNzEzNTA1NzQ5.LryNM6WILrpe-2-UqRul1Xnev1cPB5s39fvfm6dts_Qg.LZbM3LpAMwFdjRMHsJSK_s43kwDIFsNCU9VXBLtPaRAg.JPEG/900_20260629_133529.jpg?type=w386",
      "https://postfiles.pstatic.net/MjAyNjA2MjlfMTEx/MDAxNzgyNzEzNTA2OTM5.lmjPc0CBtsheYpKPfadTKeqXdZqDRLmxuPuAxubiDGog.6spNm2Hcs5OW0JSHOtbSAN8Wqjk713NiLJI1NszC2-Eg.JPEG/900_20260629_133534.jpg?type=w386",
      "https://postfiles.pstatic.net/MjAyNjA2MjlfMjU1/MDAxNzgyNzEzNTA4MjI0.inhOa364TgPJbn4yF8KFkw-kPND704juM2fb_YWQft8g.OmfPbu4YZoELr2uw6yWAikXxY2QbnCSRnKPrzUP7J0Ig.JPEG/900_20260629_133537.jpg?type=w386"
    ],
    collageBenefit: [
      "https://postfiles.pstatic.net/MjAyNjA2MjlfNDQg/MDAxNzgyNzEzNDk5MDAz.CQ206Bkt5g31laSXWR8WENEMgUmjcfHT9FKTofCypvAg.GxTnfapbcg78A08vei1I5b9fu0qeUgjINAfXtuvo2bIg.JPEG/900_20260629_133350.jpg?type=w386",
      "https://postfiles.pstatic.net/MjAyNjA2MjlfMjgx/MDAxNzgyNzEzNTAwNzMz.peo-A1MHaGXzCEpZTcJXyS0LpVC7nVWML50oV4wZBrsg.gWBpZZIXol8z004OihgASBXgokUIwxyGDEouuTO_jEMg.JPEG/900_20260629_133351.jpg?type=w386",
      "https://postfiles.pstatic.net/MjAyNjA2MjlfNTkg/MDAxNzgyNzEzNTAxODM2.-as0aGxlX3U6cgiFD96ZlaSrQziH9y6Tw8Z2K3jPbVgg.gkHAZzZsaDuFgmt8RMObcbMcWi9UuIBFATMz3C8dT3Ug.JPEG/900_20260629_133356.jpg?type=w773",
      "https://postfiles.pstatic.net/MjAyNjA2MjlfMTg3/MDAxNzgyNzEzNTAzMDI2.JOojpldxv3fWlpapdHFXcQ4P2bv6qLYpRe0XGRDmv5wg.iOXbK3cP_n39dGdx8jwr62_pMgPXCbIlmkYl1CjquFcg.JPEG/900_20260629_133254.jpg?type=w386"
    ],
    collageSummary: [
      "https://postfiles.pstatic.net/MjAyNjA2MjlfMTI1/MDAxNzgyNzEzNDk4ODI5.z-pnugHH-7Cua_H87AOeV5PllVJ03p5vY39-fM5k2OUg.MrmHDGRnOhStPWFEknNIJl5JEu8l1SiU0p4usFbrAtUg.JPEG/900_20260629_133323.jpg?type=w386",
      "https://postfiles.pstatic.net/MjAyNjA2MjlfMjA3/MDAxNzgyNzEzNTAwMzQ4.mTkgwTQQLfiPae9xDU7xGLC2SQBVeBKojceefvy0vQkg.WNENnGpVZGspIZ5lsiN-AHxN8P8lOT3M3gmiancz3bIg.JPEG/900_20260629_133629.jpg?type=w386",
      "https://postfiles.pstatic.net/MjAyNjA2MjlfMjQ5/MDAxNzgyNzEzNTAxODM2.na8IOklTbA0Tf6X1SIqw_FXFoNaOjs_n4xKdEQ1EibMg.T2hiOFe9HUnyIMA3RdwL8ENYy32rpV62AybeslJJezIg.JPEG/900_20260629_133627.jpg?type=w386",
      "https://postfiles.pstatic.net/MjAyNjA2MjlfMjM5/MDAxNzgyNzEzNTAzMTYx.W60_fO30znP2U3YSpQg42VwN0MsqOxjRkWpVV1Vf_98g.7qpGDrhwdzc1gVi8cqpOF49eb_E_Droxj4FpMiiMTXgg.JPEG/900_20260629_133624.jpg?type=w386"
    ]
  },

  textCenter(lines, extraClass = "") {
    const paragraphs = lines
      .map((line) => {
        if (line === "") return '<p class="se-text-paragraph se-text-paragraph-align-center"><span>​</span></p>';
        return \`<p class="se-text-paragraph se-text-paragraph-align-center"><span>\${line}</span></p>\`;
      })
      .join("");
    return \`<div class="se-component se-text se-l-default \${extraClass}">
      <div class="se-component-content">
        <div class="se-section se-section-text se-l-default">
          <div class="se-module se-module-text">\${paragraphs}</div>
        </div>
      </div>
    </div>\`;
  },

  quoteLine(lines) {
    const paragraphs = lines.map((line) => \`<p class="se-text-paragraph"><span>\${line}</span></p>\`).join("");
    return \`<div class="se-component se-quotation se-l-quotation_line">
      <div class="se-component-content">
        <div class="se-section se-section-quotation se-l-quotation_line">
          <blockquote class="se-quotation-container">
            <div class="se-module se-module-text se-quote">\${paragraphs}</div>
          </blockquote>
        </div>
      </div>
    </div>\`;
  },

  quoteUnderline(title) {
    return \`<div class="se-component se-quotation se-l-quotation_underline">
      <div class="se-component-content">
        <div class="se-section se-section-quotation se-l-quotation_underline">
          <blockquote class="se-quotation-container">
            <div class="se-module se-module-text se-quote"><p class="se-text-paragraph"><span>\${title}</span></p></div>
          </blockquote>
        </div>
      </div>
    </div>\`;
  },

  image(src, alt = "") {
    return \`<div class="se-component se-image se-l-default">
      <div class="se-component-content se-component-content-fit">
        <div class="se-section se-section-image se-l-default se-section-align-center">
          <div class="se-module se-module-image se-image-loaded">
            <img src="\${src}" alt="\${alt}" class="se-image-resource">
          </div>
        </div>
      </div>
    </div>\`;
  },

  sticker(src) {
    return \`<div class="se-component se-sticker se-l-default">
      <div class="se-component-content">
        <div class="se-section se-section-sticker se-section-align-center se-l-default">
          <div class="se-module se-module-sticker se-image-loaded">
            <img src="\${src}" alt="" class="se-sticker-image">
          </div>
        </div>
      </div>
    </div>\`;
  },

  map() {
    return \`<div class="se-component se-placesMap se-l-default">
      <div class="se-component-content">
        <div class="se-section se-section-placesMap se-section-align-center se-l-default">
          <div class="se-module se-module-map-image">
            <img src="\${this.images.mapStatic}" alt="옆커폰 부개점 지도" class="se-map-image">
          </div>
          <div class="se-module se-module-map-text">
            <a href="#" class="se-map-info" onclick="return false;">
              <strong class="se-map-title">휴대폰성지 옆커폰 부개점</strong>
              <p class="se-map-address">인천광역시 부평구 부일로 30 1층</p>
            </a>
          </div>
        </div>
      </div>
    </div>\`;
  },

  imageGroupCollage(urls, widths = ["50%", "50%", "24%", "76%"]) {
    const row1 = urls.slice(0, 2)
      .map((src, i) => \`<div class="se-module se-module-image se-image-loaded" style="width:\${widths[i] || "50%"}"><img src="\${src}" alt="" class="se-image-resource"></div>\`)
      .join("");
    const row2 = urls.slice(2, 4)
      .map((src, i) => \`<div class="se-module se-module-image se-image-loaded" style="width:\${widths[i + 2] || "50%"}"><img src="\${src}" alt="" class="se-image-resource"></div>\`)
      .join("");
    return \`<div class="se-component se-imageGroup se-l-collage">
      <div class="se-component-content se-component-content-extend">
        <div class="se-section se-section-imageGroup se-l-collage">
          <div class="se-imageGroup-viewer">
            <div class="se-imageGroup-container">
              <div class="se-imageGroup-item se-imageGroup-col-2">\${row1}</div>
              <div class="se-imageGroup-item se-imageGroup-col-2">\${row2}</div>
            </div>
          </div>
        </div>
      </div>
    </div>\`;
  },

  buildHtml() {
    const i = this.images;
    const sections = [
      this.textCenter(['<b style="color:#b7b7b7">본 포스팅은, 업체로부터 제품과 소정의 원고료를 지원받아 작성된 후기입니다.</b>', "", "안녕하세요"]),
      this.sticker(i.stickerHello),
      this.textCenter(["휴대폰 저렴하게 구매할 수 있는", "휴대폰성지 옆커폰 부개점 방문했어요", "바로 소개해드릴게요"]),
      this.map(),
      this.quoteLine(["휴대폰성지 옆커폰 부개점", "주소 - 인천 부평구 부일로 30 1층", '영업시간 - 월~토 11:00 ~ 19:30 (<span style="color:#f12f22">매주 일요일 정기휴무</span>)', "전화번호 - 0507-1351-0071"]),
      this.image(i.storeLogo, "휴대폰성지 옆커폰 부개점"),
      this.quoteUnderline("인천 휴대폰 성지를 찾게 된 이유(사전승낙서)"),
      this.image(i.certificate, "사전승낙서"),
      this.textCenter([
        "이동통신서비스 판매점과 알뜰폰 판매점 사전승낙서가 존재하는 휴대폰성지 옆커폰 부개점!", "",
        "아무래도 핸드폰은 요즘 필수로 사용하지만", "금액대는 너무 높아서 어디서 구매할지 고민이 많은데요", "",
        "인천부평구휴대폰성지인 옆커폰 부개점에 방문해서", "요즘 핸드폰 가격은 어떤지 확인하고 싶어서 방문했어요!"
      ]),
      this.quoteUnderline("휴대폰성지 옆커폰 부개점 위치 및 매장 분위기"),
      this.image(i.exteriorWide, "매장 외관"),
      this.image(i.exteriorDoor, "매장 유리문"),
      this.textCenter([
        "위치는 부개역과 부평역 사이에 있고", "역에서 10분정도? 걸으면 있는 곳에 있어서", "저는 편하게 걸어서 방문했어요!", "",
        "주차는 공간이 없어서 주변 공영주차장을 이용하시면 되는데요", "개인적으로 주차공간이 없기 때문에", "대중교통을 이용해서 방문하시는걸 추천드려요 ㅎㅎ"
      ]),
      this.imageGroupCollage(i.collageInterior),
      this.textCenter([
        "매장 분위기는 정말 쾌적했어요!", "한 눈이 볼 수 있게 핸드폰이 쫙 나열되어 있었고",
        "정보 관련해서도 한 눈이 볼 수 있도록", "표로 정리되어 있어서 보기가 편하더라고요 ㅎㅎ", "",
        "방문하자마자 시원하게 에어컨도 틀어져있어서", "더위도 날리고 넘 편하게 이용할 수 있었어요 ㅎㅎ",
        "직원분께서도 반갑게 인사해주셔서 넘 좋더라고요 ㅋㅋ"
      ]),
      this.quoteUnderline("기기변경·번호이동 상담 후기"),
      this.imageGroupCollage(i.collageConsult),
      this.textCenter([
        "기기변경과 번호이동에 대해서 상담을 받아봤는데요", "확실히 다른 곳 보다 투명한 가격으로 운영하고", "정확하게 알려주셔서 넘 좋더라고요", "",
        "핸드폰을 구매할 때 가장 중요한건 가격인데", "가격대도 저렴하게 확인할 수 있어서", "여기서 구매해도 좋겠는데? 라는 생각이 들었어요", "",
        "가까운 곳에 이렇게 저렴한 곳이 있다니", "정말 좋았어요 ㅋㅋ"
      ]),
      this.quoteUnderline("인천 휴대폰 싼곳으로 추천하는 이유"),
      this.imageGroupCollage(i.collageRecommend),
      this.textCenter(["휴대폰의 기종도 다양하고", "투명한 가격을 어필하기 때문에 확실히", "저렴하다는 생각이 많이 들었어요", ""]),
      this.imageGroupCollage(i.collageAward),
      this.textCenter([
        "옆커폰은 소비자선정 우수기업 브랜드에서", "대상을 탔고, 유튜브 실버버튼도 존재하도라고요!", "실버버튼을 실제로 처음봤는데 ㅋㅋ",
        "이렇게 받을 수 있는 이유가 있지 않을까요?", "", "상담도 정말 친절하시고 기분 좋게 핸드폰 상담을", "할 수 있어서 좋아요!", "",
        "당장 결정한다기보단 다른 매장에 가보면 알 수 있겠지만", "친절함도 핸드폰을 바꿀 때 중요한 부분 중 하나인데",
        "정말 친절하시고 가격대도 저렴해서", "인천부평휴대폰성지 핸드폰 싼 곳으로 유명한 것 같았어요 ㅎㅎ"
      ]),
      this.quoteUnderline("구매 혜택 및 할인 정보"),
      this.imageGroupCollage(i.collageBenefit, ["50%", "50%", "76%", "24%"]),
      this.textCenter([
        "인터넷과 티비를 같이 신청하게 되면", "현금으로는 최대 50만원 증정이 가능하고", "최대 170만원까지 혜택을 받을 수 있어요!!",
        "저렴하게 구매도하고 혜택도 확실하게 받을 수 있는", "인천부평휴대폰성지 옆커폰 부개점이에요 ㅎㅎ"
      ]),
      this.quoteUnderline("휴대폰성지 옆커폰 부개점 총평"),
      this.imageGroupCollage(i.collageSummary, ["43%", "57%", "50%", "50%"]),
      this.textCenter([
        "개인적으로 핸드폰을 구매하게된다면 정말 괜찮은 곳이다", "라고 느낄 수 있는 곳이였고",
        "매장 내에서 상담 받는것도 편안한 분위기라 정말 좋았어요!", "",
        "저는 체험단이라 고속충전기 제품을 받아왔는데", "아이폰 충전기인데 정말 빠르고 좋더라고요 ㅋㅋ",
        "이런 제품들도 퀄리티가 좋아서 아주 만족하고 왔답니당 ㅎㅎ", "", "그럼 전 다음 리뷰로 돌아올게요"
      ]),
      this.sticker(i.stickerBye),
      this.textCenter([
        "#인천휴대폰성지 #인천부평구휴대폰성지 #인천휴대폰싼곳 #휴대폰성지옆커폰부개점 #옆커폰 #부개동휴대폰 #부평휴대폰 #부평핸드폰 #인천핸드폰성지 #휴대폰성지 #핸드폰성지 #휴대폰할인 #휴대폰구매 #기기변경 #번호이동 #스마트폰구매 #아이폰성지 #갤럭시성지 #휴대폰추천 #통신사혜택 #휴대폰매장 #인천휴대폰매장 #부평휴대폰성지 #휴대폰후기 #스마트폰 #휴대폰정보 #인천생활 #내돈내산 #휴대폰저렴하게 #성지추천"
      ])
    ];

    return \`<div class="se-main-container">\${sections.join("")}</div>\`;
  },

  getContent() {
    return "휴대폰성지 옆커폰 부개점 방문 후기. 사전승낙서, 위치·매장 분위기, 기기변경·번호이동 상담, 구매 혜택 및 총평.";
  }
};
`;

fs.writeFileSync(outPath, content, "utf8");
console.log("Wrote", outPath);

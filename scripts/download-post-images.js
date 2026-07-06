const fs = require("fs");
const path = require("path");
const https = require("https");

const outDir = path.join(__dirname, "..", "assets", "images", "post");

const images = [
  { file: "post-store-logo.png", url: "https://postfiles.pstatic.net/MjAyNjA2MjlfNzAg/MDAxNzgyNzEyNDc1NzU2.7i2ZG2Ply0JE-gvfQaH01HC-lETD0wFKQtGbKpIk_d8g.9lFurot37EjLOz6y1WtL8TilfoDdfJQnix9gnkxIse0g.PNG/%ED%9C%B4%EB%8C%80%ED%8F%B0_%EC%84%B1%EC%A7%80_%EC%98%86%EC%BB%A4%ED%8F%B0%EB%B6%80%EA%B0%9C%EC%A0%90.png?type=w773" },
  { file: "post-certificate.jpg", url: "https://postfiles.pstatic.net/MjAyNjA2MjlfMjAw/MDAxNzgyNzEyNzkzODQ0.UsDVgaA92B1zYKbXoKBYHMS8UwTcTbfSopA8Qj_Fu8cg.JRNF69HQy-aWlVSBawVCteLAztwOquzfYNIU6t9zffsg.JPEG/900_20260629_133407.jpg?type=w773" },
  { file: "post-exterior-wide.jpg", url: "https://postfiles.pstatic.net/MjAyNjA2MjlfOSAg/MDAxNzgyNzEyNDc1ODc4.dYZt8IM3cQIZwu5YPzltOS1403wFtNtDqtbVm9O3htkg.S1GTnqVxLGAng6CRV18Fk9qL-liLXCxts9x1AvuSMaEg.JPEG/900_1782712418843.jpg?type=w773" },
  { file: "post-exterior-door.jpg", url: "https://postfiles.pstatic.net/MjAyNjA2MjlfMjQy/MDAxNzgyNzEyNDc1ODc4.IYAhFj-JO2oXMA1Ysh09m07W6rFZM-QUvk9_3aHFf74g.EFEppaSUZE7Udi3byq5Bndves7A__Au6wQ7vNgl2jyIg.JPEG/900_20260629_133157.jpg?type=w773" },
  { file: "post-map.jpg", url: "https://simg.pstatic.net/static.map/v2/map/staticmap.bin?caller=smarteditor&markers=size%3Amid%7Ccolor%3A0x11cc73%7Ctype%3Ad%7CviewSizeRatio%3A0.7%7Cpos%3A126.733507%2037.489695&w=892&h=433&center=126.7335074%2C37.4896946&level=17&scale=2&dataversion=178.10" },
  { file: "post-sticker-hello.png", url: "https://storep-phinf.pstatic.net/ogq_6483daec1ba38/original_2.png?type=p100_100" },
  { file: "post-sticker-bye.png", url: "https://storep-phinf.pstatic.net/ogq_6483daec1ba38/original_23.png?type=p100_100" },
  { file: "post-interior-01.jpg", url: "https://postfiles.pstatic.net/MjAyNjA2MjlfMTAy/MDAxNzgyNzEyNzk0MDA2.gzDjV6tW3yHH2_v51MeLp23X0TSdw-AmF4VgGgkaMd8g.RV2tGzJXxGi9LlRncnLlt_ZzBF7w856aUZkLJRa2CyMg.JPEG/900_20260629_133221.jpg?type=w773" },
  { file: "post-interior-02.jpg", url: "https://postfiles.pstatic.net/MjAyNjA2MjlfMjA1/MDAxNzgyNzEyNzk1NzEx.DEuqnKSwN_iPqBZpd0aJA-CvLE2D_F3fA-_wTOw9Btsg._J58QHaRSyff9ZGmM3qOxJAyHGD80b4XyEz-5hzfGTAg.JPEG/900_20260629_133223.jpg?type=w773" },
  { file: "post-interior-03.jpg", url: "https://postfiles.pstatic.net/MjAyNjA2MjlfMTEz/MDAxNzgyNzEyNzk3MjUy.60O7F8CyNqsEfVAaw9M_YYL0iF96L7iiPd2E1r3CmUgg.4GEuZCxPsqSCFkcWUDiL0WRT1PyYYypli4KzrpFsv_Eg.JPEG/900_20260629_133242.jpg?type=w773" },
  { file: "post-interior-04.jpg", url: "https://postfiles.pstatic.net/MjAyNjA2MjlfMjg2/MDAxNzgyNzEyNzk4NjY5.gKMjy0Zc_FlC1K_z_LWDny2gg1DZpx94_2-WOVDiFQ0g.kDOuzPJij1wwQoHmJe4xYPATkEBoh1yUbq6CvhDKiXgg.JPEG/900_20260629_133249.jpg?type=w773" },
  { file: "post-consult-01.jpg", url: "https://postfiles.pstatic.net/MjAyNjA2MjlfMTYg/MDAxNzgyNzEzNDk5MTIx.mEFTxXvF4vbJbNikLqScQnE1Kfhv56VJp0ft4bFyrYMg.8sqQtYNeGbF8WXEHfU3JxQ6Q49nSXUuqd90WOq6Y8G0g.JPEG/900_20260629_133309.jpg?type=w773" },
  { file: "post-consult-02.jpg", url: "https://postfiles.pstatic.net/MjAyNjA2MjlfOSAg/MDAxNzgyNzEzNTAwODU4.hy395ME2KV0M2hjxjBAiUe4Wfrp5o9qrLGyZPRF2crUg.3wLAS0FMLZ0VsShtjQjqnbTMCzdTMjiq_3DSN18Xe7Ag.JPEG/900_20260629_133306.jpg?type=w773" },
  { file: "post-consult-03.jpg", url: "https://postfiles.pstatic.net/MjAyNjA2MjlfMyAg/MDAxNzgyNzEzNTAyMjMz.uiZ-zY36V0soVuEvuS_4k0iOu6QUn_lRDeLSYzS8incg.bV0mkcrEKpJS8XTpMCHGs3JZcTUiNp2atfhiymeiB4wg.JPEG/900_20260629_133447.jpg?type=w773" },
  { file: "post-consult-04.jpg", url: "https://postfiles.pstatic.net/MjAyNjA2MjlfMTA3/MDAxNzgyNzEzNTAzNDU0.oWZTQkBJBtsBnEmYW4qtJHRaeJ1jTT2BcBjIpEIB6PMg.3hOkSjGLP7tIqi2IsEHwFhtEpo-QmnXBAfW-BrIkBr4g.JPEG/900_20260629_133456.jpg?type=w773" },
  { file: "post-recommend-01.jpg", url: "https://postfiles.pstatic.net/MjAyNjA2MjlfMjU2/MDAxNzgyNzEzNDk5MDkz.H8BkZp-sVwW4f2CamkKg0FgKz18sg1UsxpVB5Cphzwcg.R5jDmy-ZCCuS2Xn1tkIaW0U-djcy77BRXYxJqzAYprUg.JPEG/900_20260629_133512.jpg?type=w773" },
  { file: "post-recommend-02.jpg", url: "https://postfiles.pstatic.net/MjAyNjA2MjlfMTcg/MDAxNzgyNzEzNTAwNTI1.x3LjP3c0dU9ZBDUqqojG9uWVsM8IQmzA7pSlztlGpDAg.04eneFYUbXQak8e-FcMDk4nyjTu-C1mIERou8C4M3Aog.JPEG/900_20260629_133514.jpg?type=w773" },
  { file: "post-recommend-03.jpg", url: "https://postfiles.pstatic.net/MjAyNjA2MjlfMjY1/MDAxNzgyNzEzNTAyMDI1.Ad752qYPqF7DdU-yYa2mo1fY5lb-Or8Yvj8FV68Wvn8g.2jM2whNI1Mg69r3-TgAd99pYZSuFx9N_BEwZbRgky_sg.JPEG/900_20260629_133517.jpg?type=w773" },
  { file: "post-recommend-04.jpg", url: "https://postfiles.pstatic.net/MjAyNjA2MjlfMjAg/MDAxNzgyNzEzNTAzNTU1.orDMTW1urfNq2H2xsClmHFxIvUzpNWK9_IphzffntGsg.UrKyCk96YG5jYjpAm4EN97aNgl_WJc8Lt23Rk24ODRIg.JPEG/900_20260629_133519.jpg?type=w773" },
  { file: "post-award-01.jpg", url: "https://postfiles.pstatic.net/MjAyNjA2MjlfMjY2/MDAxNzgyNzEzNTA0NDc3.epOfpyRWJmjynQz46fWba_CpPsyM_zvK-x0k2w9c-Igg.VEBdpGgA3dEvhKr8DVhqcPp4fBT3zUvymqAcDDpB_84g.JPEG/900_20260629_133522.jpg?type=w773" },
  { file: "post-award-02.jpg", url: "https://postfiles.pstatic.net/MjAyNjA2MjlfMTQ0/MDAxNzgyNzEzNTA1NzQ5.LryNM6WILrpe-2-UqRul1Xnev1cPB5s39fvfm6dts_Qg.LZbM3LpAMwFdjRMHsJSK_s43kwDIFsNCU9VXBLtPaRAg.JPEG/900_20260629_133529.jpg?type=w773" },
  { file: "post-award-03.jpg", url: "https://postfiles.pstatic.net/MjAyNjA2MjlfMTEx/MDAxNzgyNzEzNTA2OTM5.lmjPc0CBtsheYpKPfadTKeqXdZqDRLmxuPuAxubiDGog.6spNm2Hcs5OW0JSHOtbSAN8Wqjk713NiLJI1NszC2-Eg.JPEG/900_20260629_133534.jpg?type=w773" },
  { file: "post-award-04.jpg", url: "https://postfiles.pstatic.net/MjAyNjA2MjlfMjU1/MDAxNzgyNzEzNTA4MjI0.inhOa364TgPJbn4yF8KFkw-kPND704juM2fb_YWQft8g.OmfPbu4YZoELr2uw6yWAikXxY2QbnCSRnKPrzUP7J0Ig.JPEG/900_20260629_133537.jpg?type=w773" },
  { file: "post-benefit-01.jpg", url: "https://postfiles.pstatic.net/MjAyNjA2MjlfNDQg/MDAxNzgyNzEzNDk5MDAz.CQ206Bkt5g31laSXWR8WENEMgUmjcfHT9FKTofCypvAg.GxTnfapbcg78A08vei1I5b9fu0qeUgjINAfXtuvo2bIg.JPEG/900_20260629_133350.jpg?type=w773" },
  { file: "post-benefit-02.jpg", url: "https://postfiles.pstatic.net/MjAyNjA2MjlfMjgx/MDAxNzgyNzEzNTAwNzMz.peo-A1MHaGXzCEpZTcJXyS0LpVC7nVWML50oV4wZBrsg.gWBpZZIXol8z004OihgASBXgokUIwxyGDEouuTO_jEMg.JPEG/900_20260629_133351.jpg?type=w773" },
  { file: "post-benefit-03.jpg", url: "https://postfiles.pstatic.net/MjAyNjA2MjlfNTkg/MDAxNzgyNzEzNTAxODM2.-as0aGxlX3U6cgiFD96ZlaSrQziH9y6Tw8Z2K3jPbVgg.gkHAZzZsaDuFgmt8RMObcbMcWi9UuIBFATMz3C8dT3Ug.JPEG/900_20260629_133356.jpg?type=w773" },
  { file: "post-benefit-04.jpg", url: "https://postfiles.pstatic.net/MjAyNjA2MjlfMTg3/MDAxNzgyNzEzNTAzMDI2.JOojpldxv3fWlpapdHFXcQ4P2bv6qLYpRe0XGRDmv5wg.iOXbK3cP_n39dGdx8jwr62_pMgPXCbIlmkYl1CjquFcg.JPEG/900_20260629_133254.jpg?type=w773" },
  { file: "post-summary-01.jpg", url: "https://postfiles.pstatic.net/MjAyNjA2MjlfMTI1/MDAxNzgyNzEzNDk4ODI5.z-pnugHH-7Cua_H87AOeV5PllVJ03p5vY39-fM5k2OUg.MrmHDGRnOhStPWFEknNIJl5JEu8l1SiU0p4usFbrAtUg.JPEG/900_20260629_133323.jpg?type=w773" },
  { file: "post-summary-02.jpg", url: "https://postfiles.pstatic.net/MjAyNjA2MjlfMjA3/MDAxNzgyNzEzNTAwMzQ4.mTkgwTQQLfiPae9xDU7xGLC2SQBVeBKojceefvy0vQkg.WNENnGpVZGspIZ5lsiN-AHxN8P8lOT3M3gmiancz3bIg.JPEG/900_20260629_133629.jpg?type=w773" },
  { file: "post-summary-03.jpg", url: "https://postfiles.pstatic.net/MjAyNjA2MjlfMjQ5/MDAxNzgyNzEzNTAxODM2.na8IOklTbA0Tf6X1SIqw_FXFoNaOjs_n4xKdEQ1EibMg.T2hiOFe9HUnyIMA3RdwL8ENYy32rpV62AybeslJJezIg.JPEG/900_20260629_133627.jpg?type=w773" },
  { file: "post-summary-04.jpg", url: "https://postfiles.pstatic.net/MjAyNjA2MjlfMjM5/MDAxNzgyNzEzNTAzMTYx.W60_fO30znP2U3YSpQg42VwN0MsqOxjRkWpVV1Vf_98g.7qpGDrhwdzc1gVi8cqpOF49eb_E_Droxj4FpMiiMTXgg.JPEG/900_20260629_133624.jpg?type=w773" }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const request = (targetUrl) => {
      https
        .get(
          targetUrl,
          {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
              Referer: "https://blog.naver.com/"
            }
          },
          (res) => {
            if ([301, 302, 307, 308].includes(res.statusCode) && res.headers.location) {
              request(res.headers.location);
              return;
            }
            if (res.statusCode !== 200) {
              reject(new Error(`HTTP ${res.statusCode} for ${targetUrl}`));
              return;
            }
            const file = fs.createWriteStream(dest);
            res.pipe(file);
            file.on("finish", () => file.close(() => resolve(dest)));
            file.on("error", reject);
          }
        )
        .on("error", reject);
    };
    request(url);
  });
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  let ok = 0;
  for (const item of images) {
    const dest = path.join(outDir, item.file);
    process.stdout.write(`Downloading ${item.file}... `);
    try {
      await download(item.url, dest);
      const size = fs.statSync(dest).size;
      console.log(`OK (${size} bytes)`);
      ok++;
    } catch (err) {
      console.log(`FAIL: ${err.message}`);
    }
  }
  console.log(`\nDone: ${ok}/${images.length} images saved to assets/images/post/`);
}

main();

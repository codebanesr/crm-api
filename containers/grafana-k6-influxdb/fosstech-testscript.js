import { group, sleep } from "k6";
import http from "k6/http";

// Version: 1.2
// Creator: WebInspector

export let options = {
  maxRedirects: 0,
  stages: [
    { target: 50, duration: "30s" },
    { target: 50, duration: "1m" },
    { target: 0, duration: "30s" },
  ],
};

export default function () {
  group("Global", function () {
    let req, res;
    req = [
      {
        method: "post",
        url: "http://localhost:3000/user/login",
        body: '{"email":"shanur.cse.nitap@gmail.com","password":"password"}',
        params: {
          headers: {
            Host: "localhost:3000",
            Connection: "keep-alive",
            Accept: "application/json, text/plain, */*",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            "Content-Type": "application/json",
            Origin: "http://localhost:4200",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
          },
        },
      },
      {
        method: "options",
        url: "http://localhost:3000/user/login",
        params: {
          headers: {
            Host: "localhost:3000",
            Connection: "keep-alive",
            Accept: "*/*",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
            Origin: "http://localhost:4200",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
          },
        },
      },
      {
        method: "get",
        url: "http://localhost:4200/pages-welcome-welcome-module.js",
        params: {
          cookies: {
            grafana_session: "59b1f6481488680a819b6661e7abdcf0",
          },
          headers: {
            Host: "localhost:4200",
            Connection: "keep-alive",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            Accept: "*/*",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "no-cors",
            "Sec-Fetch-Dest": "script",
            Referer: "http://localhost:4200/",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
          },
        },
      },
      {
        method: "post",
        url: "http://localhost:3000/lead/findAll",
        body:
          '{"page":1,"perPage":15,"searchTerm":"","filters":{"assigned":true},"showCols":[]}',
        params: {
          headers: {
            Host: "localhost:3000",
            Connection: "keep-alive",
            Accept: "application/json, text/plain, */*",
            Authorization:
              "Bearer 13142f822ce3ac59920278811d12e301b8f03ce930644b766bdf467fd619f2767aafe3bbbd8d7805fb5b901207971c13d71a989ba36cda6d362c062da48990c73ac1aa20f54b417a82b794b5dcae14fd8cabe6d418cdf05ed986d9d65ebe3413dbae43286755e1dad13a8e3b7ac7db8195d50fdd5f5f4909226f7d9e6cb25f32f8c6c2f0ddcf0062dec1d0b1de047fac0924ad0fbe37773b820be755fee5b036bc265fbca9cc73328aaec857c1bffbdff3dc5d522058edfd30b315dbb7878754dc6d66b3bc6cc61c034960ec879504342e50fbc21728924a59465a260ae232e3b1b89ede17f474d767a91c31ce8a1f282fad09a48092d26ed9d65e70adc5e22463cbe19a640478e69d84d8cf34b29c79",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            "Content-Type": "application/json",
            Origin: "http://localhost:4200",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
          },
        },
      },
      {
        method: "get",
        url: "http://localhost:3000/lead/getAllLeadColumns",
        params: {
          headers: {
            Host: "localhost:3000",
            Connection: "keep-alive",
            Accept: "application/json, text/plain, */*",
            Authorization:
              "Bearer 13142f822ce3ac59920278811d12e301b8f03ce930644b766bdf467fd619f2767aafe3bbbd8d7805fb5b901207971c13d71a989ba36cda6d362c062da48990c73ac1aa20f54b417a82b794b5dcae14fd8cabe6d418cdf05ed986d9d65ebe3413dbae43286755e1dad13a8e3b7ac7db8195d50fdd5f5f4909226f7d9e6cb25f32f8c6c2f0ddcf0062dec1d0b1de047fac0924ad0fbe37773b820be755fee5b036bc265fbca9cc73328aaec857c1bffbdff3dc5d522058edfd30b315dbb7878754dc6d66b3bc6cc61c034960ec879504342e50fbc21728924a59465a260ae232e3b1b89ede17f474d767a91c31ce8a1f282fad09a48092d26ed9d65e70adc5e22463cbe19a640478e69d84d8cf34b29c79",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            Origin: "http://localhost:4200",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "If-None-Match": 'W/"11bb-j0YLOBIRKkeCYBL0xLAHumn3pdY"',
          },
        },
      },
      {
        method: "options",
        url: "http://localhost:3000/lead/findAll",
        params: {
          headers: {
            Host: "localhost:3000",
            Connection: "keep-alive",
            Accept: "*/*",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "authorization,content-type",
            Origin: "http://localhost:4200",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
          },
        },
      },
      {
        method: "get",
        url:
          "http://localhost:3000/user/allUsers?page=0&results=20&sortField=abc&sortOrder=asc",
        params: {
          headers: {
            Host: "localhost:3000",
            Connection: "keep-alive",
            Accept: "application/json, text/plain, */*",
            Authorization:
              "Bearer 13142f822ce3ac59920278811d12e301b8f03ce930644b766bdf467fd619f2767aafe3bbbd8d7805fb5b901207971c13d71a989ba36cda6d362c062da48990c73ac1aa20f54b417a82b794b5dcae14fd8cabe6d418cdf05ed986d9d65ebe3413dbae43286755e1dad13a8e3b7ac7db8195d50fdd5f5f4909226f7d9e6cb25f32f8c6c2f0ddcf0062dec1d0b1de047fac0924ad0fbe37773b820be755fee5b036bc265fbca9cc73328aaec857c1bffbdff3dc5d522058edfd30b315dbb7878754dc6d66b3bc6cc61c034960ec879504342e50fbc21728924a59465a260ae232e3b1b89ede17f474d767a91c31ce8a1f282fad09a48092d26ed9d65e70adc5e22463cbe19a640478e69d84d8cf34b29c79",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            Origin: "http://localhost:4200",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "If-None-Match": 'W/"50dc-jQI44Flai3kwILetR7aJdVKL2Is"',
          },
        },
      },
      {
        method: "options",
        url: "http://localhost:3000/lead/getAllLeadColumns",
        params: {
          headers: {
            Host: "localhost:3000",
            Connection: "keep-alive",
            Accept: "*/*",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "authorization",
            Origin: "http://localhost:4200",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
          },
        },
      },
      {
        method: "get",
        url: "http://localhost:3000/lead/basicOverview",
        params: {
          headers: {
            Host: "localhost:3000",
            Connection: "keep-alive",
            Accept: "application/json, text/plain, */*",
            Authorization:
              "Bearer 13142f822ce3ac59920278811d12e301b8f03ce930644b766bdf467fd619f2767aafe3bbbd8d7805fb5b901207971c13d71a989ba36cda6d362c062da48990c73ac1aa20f54b417a82b794b5dcae14fd8cabe6d418cdf05ed986d9d65ebe3413dbae43286755e1dad13a8e3b7ac7db8195d50fdd5f5f4909226f7d9e6cb25f32f8c6c2f0ddcf0062dec1d0b1de047fac0924ad0fbe37773b820be755fee5b036bc265fbca9cc73328aaec857c1bffbdff3dc5d522058edfd30b315dbb7878754dc6d66b3bc6cc61c034960ec879504342e50fbc21728924a59465a260ae232e3b1b89ede17f474d767a91c31ce8a1f282fad09a48092d26ed9d65e70adc5e22463cbe19a640478e69d84d8cf34b29c79",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            Origin: "http://localhost:4200",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "If-None-Match": 'W/"72-g2IyPVYycSDSUb/Rk7Mt7AsxTcM"',
          },
        },
      },
      {
        method: "post",
        url: "http://localhost:3000/campaign/get",
        body:
          '{"pageIndex":1,"pageSize":20,"filters":"","sortField":"","sortOrder":"asc"}',
        params: {
          headers: {
            Host: "localhost:3000",
            Connection: "keep-alive",
            Accept: "application/json, text/plain, */*",
            Authorization:
              "Bearer 13142f822ce3ac59920278811d12e301b8f03ce930644b766bdf467fd619f2767aafe3bbbd8d7805fb5b901207971c13d71a989ba36cda6d362c062da48990c73ac1aa20f54b417a82b794b5dcae14fd8cabe6d418cdf05ed986d9d65ebe3413dbae43286755e1dad13a8e3b7ac7db8195d50fdd5f5f4909226f7d9e6cb25f32f8c6c2f0ddcf0062dec1d0b1de047fac0924ad0fbe37773b820be755fee5b036bc265fbca9cc73328aaec857c1bffbdff3dc5d522058edfd30b315dbb7878754dc6d66b3bc6cc61c034960ec879504342e50fbc21728924a59465a260ae232e3b1b89ede17f474d767a91c31ce8a1f282fad09a48092d26ed9d65e70adc5e22463cbe19a640478e69d84d8cf34b29c79",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            "Content-Type": "application/json",
            Origin: "http://localhost:4200",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
          },
        },
      },
      {
        method: "options",
        url:
          "http://localhost:3000/user/allUsers?page=0&results=20&sortField=abc&sortOrder=asc",
        params: {
          headers: {
            Host: "localhost:3000",
            Connection: "keep-alive",
            Accept: "*/*",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "authorization",
            Origin: "http://localhost:4200",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
          },
        },
      },
      {
        method: "options",
        url: "http://localhost:3000/lead/basicOverview",
        params: {
          headers: {
            Host: "localhost:3000",
            Connection: "keep-alive",
            Accept: "*/*",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "authorization",
            Origin: "http://localhost:4200",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
          },
        },
      },
      {
        method: "options",
        url: "http://localhost:3000/campaign/get",
        params: {
          headers: {
            Host: "localhost:3000",
            Connection: "keep-alive",
            Accept: "*/*",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "authorization,content-type",
            Origin: "http://localhost:4200",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
          },
        },
      },
      {
        method: "get",
        url: "http://localhost:4200/assets/outline/aim.svg",
        params: {
          cookies: {
            grafana_session: "59b1f6481488680a819b6661e7abdcf0",
          },
          headers: {
            Host: "localhost:4200",
            Connection: "keep-alive",
            Accept: "application/json, text/plain, */*",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/welcome/leads/all",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "If-None-Match": 'W/"2d8-HpkiOpF/M4ul6WjA49e4ZokEGCo"',
          },
        },
      },
      {
        method: "get",
        url: "http://localhost:4200/assets/outline/plus.svg",
        params: {
          cookies: {
            grafana_session: "59b1f6481488680a819b6661e7abdcf0",
          },
          headers: {
            Host: "localhost:4200",
            Connection: "keep-alive",
            Accept: "application/json, text/plain, */*",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/welcome/leads/all",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "If-None-Match": 'W/"d7-LC1SlXd3NntxyrMDXout9aG2tI8"',
          },
        },
      },
      {
        method: "post",
        url: "http://localhost:3000/lead/findAll",
        body:
          '{"page":1,"perPage":15,"searchTerm":"","filters":{"assigned":true},"showCols":[]}',
        params: {
          headers: {
            Host: "localhost:3000",
            Connection: "keep-alive",
            Accept: "application/json, text/plain, */*",
            Authorization:
              "Bearer 13142f822ce3ac59920278811d12e301b8f03ce930644b766bdf467fd619f2767aafe3bbbd8d7805fb5b901207971c13d71a989ba36cda6d362c062da48990c73ac1aa20f54b417a82b794b5dcae14fd8cabe6d418cdf05ed986d9d65ebe3413dbae43286755e1dad13a8e3b7ac7db8195d50fdd5f5f4909226f7d9e6cb25f32f8c6c2f0ddcf0062dec1d0b1de047fac0924ad0fbe37773b820be755fee5b036bc265fbca9cc73328aaec857c1bffbdff3dc5d522058edfd30b315dbb7878754dc6d66b3bc6cc61c034960ec879504342e50fbc21728924a59465a260ae232e3b1b89ede17f474d767a91c31ce8a1f282fad09a48092d26ed9d65e70adc5e22463cbe19a640478e69d84d8cf34b29c79",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            "Content-Type": "application/json",
            Origin: "http://localhost:4200",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
          },
        },
      },
    ];
    res = http.batch(req);
    sleep(4.23);
    req = [
      {
        method: "post",
        url: "http://localhost:3000/lead/findAll",
        body:
          '{"page":1,"perPage":15,"searchTerm":"","filters":{"assigned":true,"lead":true,"archived":false,"upcoming":false,"dateRange":null,"selectedCampaign":"5f89dd4c3d90afc740368088"},"showCols":[]}',
        params: {
          headers: {
            Host: "localhost:3000",
            Connection: "keep-alive",
            Accept: "application/json, text/plain, */*",
            Authorization:
              "Bearer 13142f822ce3ac59920278811d12e301b8f03ce930644b766bdf467fd619f2767aafe3bbbd8d7805fb5b901207971c13d71a989ba36cda6d362c062da48990c73ac1aa20f54b417a82b794b5dcae14fd8cabe6d418cdf05ed986d9d65ebe3413dbae43286755e1dad13a8e3b7ac7db8195d50fdd5f5f4909226f7d9e6cb25f32f8c6c2f0ddcf0062dec1d0b1de047fac0924ad0fbe37773b820be755fee5b036bc265fbca9cc73328aaec857c1bffbdff3dc5d522058edfd30b315dbb7878754dc6d66b3bc6cc61c034960ec879504342e50fbc21728924a59465a260ae232e3b1b89ede17f474d767a91c31ce8a1f282fad09a48092d26ed9d65e70adc5e22463cbe19a640478e69d84d8cf34b29c79",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            "Content-Type": "application/json",
            Origin: "http://localhost:4200",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
          },
        },
      },
    ];
    res = http.batch(req);
    sleep(2.1);
    req = [
      {
        method: "get",
        url:
          "http://localhost:3000/user/allUsers?page=1&results=10&sortField=null&sortOrder=null",
        params: {
          headers: {
            Host: "localhost:3000",
            Connection: "keep-alive",
            Accept: "application/json, text/plain, */*",
            Authorization:
              "Bearer 13142f822ce3ac59920278811d12e301b8f03ce930644b766bdf467fd619f2767aafe3bbbd8d7805fb5b901207971c13d71a989ba36cda6d362c062da48990c73ac1aa20f54b417a82b794b5dcae14fd8cabe6d418cdf05ed986d9d65ebe3413dbae43286755e1dad13a8e3b7ac7db8195d50fdd5f5f4909226f7d9e6cb25f32f8c6c2f0ddcf0062dec1d0b1de047fac0924ad0fbe37773b820be755fee5b036bc265fbca9cc73328aaec857c1bffbdff3dc5d522058edfd30b315dbb7878754dc6d66b3bc6cc61c034960ec879504342e50fbc21728924a59465a260ae232e3b1b89ede17f474d767a91c31ce8a1f282fad09a48092d26ed9d65e70adc5e22463cbe19a640478e69d84d8cf34b29c79",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            Origin: "http://localhost:4200",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "If-None-Match": 'W/"50dc-C/kAUEaCJnWkzNWj/PyADDo+5tk"',
          },
        },
      },
      {
        method: "get",
        url: "http://localhost:3000/user/managersForReassignment",
        params: {
          headers: {
            Host: "localhost:3000",
            Connection: "keep-alive",
            Accept: "application/json, text/plain, */*",
            Authorization:
              "Bearer 13142f822ce3ac59920278811d12e301b8f03ce930644b766bdf467fd619f2767aafe3bbbd8d7805fb5b901207971c13d71a989ba36cda6d362c062da48990c73ac1aa20f54b417a82b794b5dcae14fd8cabe6d418cdf05ed986d9d65ebe3413dbae43286755e1dad13a8e3b7ac7db8195d50fdd5f5f4909226f7d9e6cb25f32f8c6c2f0ddcf0062dec1d0b1de047fac0924ad0fbe37773b820be755fee5b036bc265fbca9cc73328aaec857c1bffbdff3dc5d522058edfd30b315dbb7878754dc6d66b3bc6cc61c034960ec879504342e50fbc21728924a59465a260ae232e3b1b89ede17f474d767a91c31ce8a1f282fad09a48092d26ed9d65e70adc5e22463cbe19a640478e69d84d8cf34b29c79",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            Origin: "http://localhost:4200",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "If-None-Match": 'W/"2-l9Fw4VUO7kr8CvBlt4zaMCqXZ0w"',
          },
        },
      },
      {
        method: "options",
        url:
          "http://localhost:3000/user/allUsers?page=1&results=10&sortField=null&sortOrder=null",
        params: {
          headers: {
            Host: "localhost:3000",
            Connection: "keep-alive",
            Accept: "*/*",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "authorization",
            Origin: "http://localhost:4200",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
          },
        },
      },
      {
        method: "options",
        url: "http://localhost:3000/user/managersForReassignment",
        params: {
          headers: {
            Host: "localhost:3000",
            Connection: "keep-alive",
            Accept: "*/*",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "authorization",
            Origin: "http://localhost:4200",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
          },
        },
      },
      {
        method: "post",
        url: "http://localhost:3000/campaign/get",
        body:
          '{"pageIndex":1,"pageSize":20,"filters":"","sortField":"","sortOrder":"asc"}',
        params: {
          headers: {
            Host: "localhost:3000",
            Connection: "keep-alive",
            Accept: "application/json, text/plain, */*",
            Authorization:
              "Bearer 13142f822ce3ac59920278811d12e301b8f03ce930644b766bdf467fd619f2767aafe3bbbd8d7805fb5b901207971c13d71a989ba36cda6d362c062da48990c73ac1aa20f54b417a82b794b5dcae14fd8cabe6d418cdf05ed986d9d65ebe3413dbae43286755e1dad13a8e3b7ac7db8195d50fdd5f5f4909226f7d9e6cb25f32f8c6c2f0ddcf0062dec1d0b1de047fac0924ad0fbe37773b820be755fee5b036bc265fbca9cc73328aaec857c1bffbdff3dc5d522058edfd30b315dbb7878754dc6d66b3bc6cc61c034960ec879504342e50fbc21728924a59465a260ae232e3b1b89ede17f474d767a91c31ce8a1f282fad09a48092d26ed9d65e70adc5e22463cbe19a640478e69d84d8cf34b29c79",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            "Content-Type": "application/json",
            Origin: "http://localhost:4200",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
          },
        },
      },
      {
        method: "options",
        url: "http://localhost:3000/campaign/get",
        params: {
          headers: {
            Host: "localhost:3000",
            Connection: "keep-alive",
            Accept: "*/*",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "authorization,content-type",
            Origin: "http://localhost:4200",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
          },
        },
      },
      {
        method: "get",
        url:
          "http://localhost:3000/user/allUsers?page=1&results=10&sortField=null&sortOrder=null",
        params: {
          headers: {
            Host: "localhost:3000",
            Connection: "keep-alive",
            Accept: "application/json, text/plain, */*",
            Authorization:
              "Bearer 13142f822ce3ac59920278811d12e301b8f03ce930644b766bdf467fd619f2767aafe3bbbd8d7805fb5b901207971c13d71a989ba36cda6d362c062da48990c73ac1aa20f54b417a82b794b5dcae14fd8cabe6d418cdf05ed986d9d65ebe3413dbae43286755e1dad13a8e3b7ac7db8195d50fdd5f5f4909226f7d9e6cb25f32f8c6c2f0ddcf0062dec1d0b1de047fac0924ad0fbe37773b820be755fee5b036bc265fbca9cc73328aaec857c1bffbdff3dc5d522058edfd30b315dbb7878754dc6d66b3bc6cc61c034960ec879504342e50fbc21728924a59465a260ae232e3b1b89ede17f474d767a91c31ce8a1f282fad09a48092d26ed9d65e70adc5e22463cbe19a640478e69d84d8cf34b29c79",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            Origin: "http://localhost:4200",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "If-None-Match": 'W/"50dc-jQI44Flai3kwILetR7aJdVKL2Is"',
          },
        },
      },
      {
        method: "get",
        url: "http://localhost:4200/assets/fill/api.svg",
        params: {
          cookies: {
            grafana_session: "59b1f6481488680a819b6661e7abdcf0",
          },
          headers: {
            Host: "localhost:4200",
            Connection: "keep-alive",
            Accept: "application/json, text/plain, */*",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/welcome/users",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "If-None-Match": 'W/"333-Za2zT1EO5UUXXhUBJn9VpNUpQGs"',
          },
        },
      },
      {
        method: "get",
        url: "http://localhost:4200/assets/outline/book.svg",
        params: {
          cookies: {
            grafana_session: "59b1f6481488680a819b6661e7abdcf0",
          },
          headers: {
            Host: "localhost:4200",
            Connection: "keep-alive",
            Accept: "application/json, text/plain, */*",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/welcome/users",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "If-None-Match": 'W/"162-E1kneAvmxvjEYQ0itZh4dGVkjPs"',
          },
        },
      },
      {
        method: "get",
        url: "http://localhost:4200/assets/outline/user-delete.svg",
        params: {
          cookies: {
            grafana_session: "59b1f6481488680a819b6661e7abdcf0",
          },
          headers: {
            Host: "localhost:4200",
            Connection: "keep-alive",
            Accept: "application/json, text/plain, */*",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/welcome/users",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "If-None-Match": 'W/"346-7+D8bF+djLcTtWjMrohN51mRt2I"',
          },
        },
      },
    ];
    res = http.batch(req);
    sleep(1.01);
    req = [
      {
        method: "get",
        url: "http://localhost:3000/user",
        params: {
          headers: {
            Host: "localhost:3000",
            Connection: "keep-alive",
            Accept: "application/json, text/plain, */*",
            Authorization:
              "Bearer 13142f822ce3ac59920278811d12e301b8f03ce930644b766bdf467fd619f2767aafe3bbbd8d7805fb5b901207971c13d71a989ba36cda6d362c062da48990c73ac1aa20f54b417a82b794b5dcae14fd8cabe6d418cdf05ed986d9d65ebe3413dbae43286755e1dad13a8e3b7ac7db8195d50fdd5f5f4909226f7d9e6cb25f32f8c6c2f0ddcf0062dec1d0b1de047fac0924ad0fbe37773b820be755fee5b036bc265fbca9cc73328aaec857c1bffbdff3dc5d522058edfd30b315dbb7878754dc6d66b3bc6cc61c034960ec879504342e50fbc21728924a59465a260ae232e3b1b89ede17f474d767a91c31ce8a1f282fad09a48092d26ed9d65e70adc5e22463cbe19a640478e69d84d8cf34b29c79",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            Origin: "http://localhost:4200",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "If-None-Match": 'W/"3bb-CGNUQTfSeJDHEge6vKB4xp6+Mrw"',
          },
        },
      },
      {
        method: "options",
        url: "http://localhost:3000/user",
        params: {
          headers: {
            Host: "localhost:3000",
            Connection: "keep-alive",
            Accept: "*/*",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "authorization",
            Origin: "http://localhost:4200",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
          },
        },
      },
      {
        method: "get",
        url: "http://localhost:3000/user/single/5f52a2aab1641937b1666f36",
        params: {
          headers: {
            Host: "localhost:3000",
            Connection: "keep-alive",
            Accept: "application/json, text/plain, */*",
            Authorization:
              "Bearer 13142f822ce3ac59920278811d12e301b8f03ce930644b766bdf467fd619f2767aafe3bbbd8d7805fb5b901207971c13d71a989ba36cda6d362c062da48990c73ac1aa20f54b417a82b794b5dcae14fd8cabe6d418cdf05ed986d9d65ebe3413dbae43286755e1dad13a8e3b7ac7db8195d50fdd5f5f4909226f7d9e6cb25f32f8c6c2f0ddcf0062dec1d0b1de047fac0924ad0fbe37773b820be755fee5b036bc265fbca9cc73328aaec857c1bffbdff3dc5d522058edfd30b315dbb7878754dc6d66b3bc6cc61c034960ec879504342e50fbc21728924a59465a260ae232e3b1b89ede17f474d767a91c31ce8a1f282fad09a48092d26ed9d65e70adc5e22463cbe19a640478e69d84d8cf34b29c79",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            Origin: "http://localhost:4200",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "If-None-Match": 'W/"243-CkPZwfE41Jw4E0CFC3/Uf7Z9nKw"',
          },
        },
      },
      {
        method: "options",
        url: "http://localhost:3000/user/single/5f52a2aab1641937b1666f36",
        params: {
          headers: {
            Host: "localhost:3000",
            Connection: "keep-alive",
            Accept: "*/*",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "authorization",
            Origin: "http://localhost:4200",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
          },
        },
      },
    ];
    res = http.batch(req);
    sleep(3.34);
    req = [
      {
        method: "get",
        url: "http://localhost:3000/campaign/disposition/core",
        params: {
          headers: {
            Host: "localhost:3000",
            Connection: "keep-alive",
            Accept: "application/json, text/plain, */*",
            Authorization:
              "Bearer 13142f822ce3ac59920278811d12e301b8f03ce930644b766bdf467fd619f2767aafe3bbbd8d7805fb5b901207971c13d71a989ba36cda6d362c062da48990c73ac1aa20f54b417a82b794b5dcae14fd8cabe6d418cdf05ed986d9d65ebe3413dbae43286755e1dad13a8e3b7ac7db8195d50fdd5f5f4909226f7d9e6cb25f32f8c6c2f0ddcf0062dec1d0b1de047fac0924ad0fbe37773b820be755fee5b036bc265fbca9cc73328aaec857c1bffbdff3dc5d522058edfd30b315dbb7878754dc6d66b3bc6cc61c034960ec879504342e50fbc21728924a59465a260ae232e3b1b89ede17f474d767a91c31ce8a1f282fad09a48092d26ed9d65e70adc5e22463cbe19a640478e69d84d8cf34b29c79",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            Origin: "http://localhost:4200",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "If-None-Match": 'W/"2d5-FhJrVGyJgbVZGG8YyGqiyURyxeg"',
          },
        },
      },
      {
        method: "get",
        url:
          "http://localhost:3000/agent/listActions?skip=0&fileType=campaignSchema",
        params: {
          headers: {
            Host: "localhost:3000",
            Connection: "keep-alive",
            Accept: "application/json, text/plain, */*",
            Authorization:
              "Bearer 13142f822ce3ac59920278811d12e301b8f03ce930644b766bdf467fd619f2767aafe3bbbd8d7805fb5b901207971c13d71a989ba36cda6d362c062da48990c73ac1aa20f54b417a82b794b5dcae14fd8cabe6d418cdf05ed986d9d65ebe3413dbae43286755e1dad13a8e3b7ac7db8195d50fdd5f5f4909226f7d9e6cb25f32f8c6c2f0ddcf0062dec1d0b1de047fac0924ad0fbe37773b820be755fee5b036bc265fbca9cc73328aaec857c1bffbdff3dc5d522058edfd30b315dbb7878754dc6d66b3bc6cc61c034960ec879504342e50fbc21728924a59465a260ae232e3b1b89ede17f474d767a91c31ce8a1f282fad09a48092d26ed9d65e70adc5e22463cbe19a640478e69d84d8cf34b29c79",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            Origin: "http://localhost:4200",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "If-None-Match": 'W/"27b-05fRnAh49WEZ1Aqoqy7ZL/OPZAc"',
          },
        },
      },
      {
        method: "options",
        url: "http://localhost:3000/campaign/disposition/core",
        params: {
          headers: {
            Host: "localhost:3000",
            Connection: "keep-alive",
            Accept: "*/*",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "authorization",
            Origin: "http://localhost:4200",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
          },
        },
      },
      {
        method: "options",
        url:
          "http://localhost:3000/agent/listActions?skip=0&fileType=campaignSchema",
        params: {
          headers: {
            Host: "localhost:3000",
            Connection: "keep-alive",
            Accept: "*/*",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "authorization",
            Origin: "http://localhost:4200",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
          },
        },
      },
      {
        method: "get",
        url:
          "http://localhost:3000/campaign/autocomplete/suggestTypes?hint=undefined",
        params: {
          headers: {
            Host: "localhost:3000",
            Connection: "keep-alive",
            Accept: "application/json, text/plain, */*",
            Authorization:
              "Bearer 13142f822ce3ac59920278811d12e301b8f03ce930644b766bdf467fd619f2767aafe3bbbd8d7805fb5b901207971c13d71a989ba36cda6d362c062da48990c73ac1aa20f54b417a82b794b5dcae14fd8cabe6d418cdf05ed986d9d65ebe3413dbae43286755e1dad13a8e3b7ac7db8195d50fdd5f5f4909226f7d9e6cb25f32f8c6c2f0ddcf0062dec1d0b1de047fac0924ad0fbe37773b820be755fee5b036bc265fbca9cc73328aaec857c1bffbdff3dc5d522058edfd30b315dbb7878754dc6d66b3bc6cc61c034960ec879504342e50fbc21728924a59465a260ae232e3b1b89ede17f474d767a91c31ce8a1f282fad09a48092d26ed9d65e70adc5e22463cbe19a640478e69d84d8cf34b29c79",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            Origin: "http://localhost:4200",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "If-None-Match": 'W/"2-l9Fw4VUO7kr8CvBlt4zaMCqXZ0w"',
          },
        },
      },
      {
        method: "options",
        url:
          "http://localhost:3000/campaign/autocomplete/suggestTypes?hint=undefined",
        params: {
          headers: {
            Host: "localhost:3000",
            Connection: "keep-alive",
            Accept: "*/*",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "authorization",
            Origin: "http://localhost:4200",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
          },
        },
      },
      {
        method: "get",
        url: "http://localhost:4200/assets/outline/setting.svg",
        params: {
          cookies: {
            grafana_session: "59b1f6481488680a819b6661e7abdcf0",
          },
          headers: {
            Host: "localhost:4200",
            Connection: "keep-alive",
            Accept: "application/json, text/plain, */*",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/welcome/campaigns/create",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "If-None-Match": 'W/"751-phkTDsZMj9ChdOCrwvpHncDyGc0"',
          },
        },
      },
      {
        method: "get",
        url: "http://localhost:4200/assets/outline/plus-square.svg",
        params: {
          cookies: {
            grafana_session: "59b1f6481488680a819b6661e7abdcf0",
          },
          headers: {
            Host: "localhost:4200",
            Connection: "keep-alive",
            Accept: "application/json, text/plain, */*",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/welcome/campaigns/create",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "If-None-Match": 'W/"18f-XQK9ZpHV60CX7Byp/eCqqxqsgo8"',
          },
        },
      },
    ];
    res = http.batch(req);
    sleep(1.93);
    req = [
      {
        method: "post",
        url: "http://localhost:3000/campaign/get",
        body: '{"pageIndex":1,"pageSize":20,"sortField":null,"sortOrder":null}',
        params: {
          headers: {
            Host: "localhost:3000",
            Connection: "keep-alive",
            Accept: "application/json, text/plain, */*",
            Authorization:
              "Bearer 13142f822ce3ac59920278811d12e301b8f03ce930644b766bdf467fd619f2767aafe3bbbd8d7805fb5b901207971c13d71a989ba36cda6d362c062da48990c73ac1aa20f54b417a82b794b5dcae14fd8cabe6d418cdf05ed986d9d65ebe3413dbae43286755e1dad13a8e3b7ac7db8195d50fdd5f5f4909226f7d9e6cb25f32f8c6c2f0ddcf0062dec1d0b1de047fac0924ad0fbe37773b820be755fee5b036bc265fbca9cc73328aaec857c1bffbdff3dc5d522058edfd30b315dbb7878754dc6d66b3bc6cc61c034960ec879504342e50fbc21728924a59465a260ae232e3b1b89ede17f474d767a91c31ce8a1f282fad09a48092d26ed9d65e70adc5e22463cbe19a640478e69d84d8cf34b29c79",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            "Content-Type": "application/json",
            Origin: "http://localhost:4200",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
          },
        },
      },
      {
        method: "get",
        url:
          "http://localhost:3000/campaign/autocomplete/suggestTypes?hint=undefined",
        params: {
          headers: {
            Host: "localhost:3000",
            Connection: "keep-alive",
            Accept: "application/json, text/plain, */*",
            Authorization:
              "Bearer 13142f822ce3ac59920278811d12e301b8f03ce930644b766bdf467fd619f2767aafe3bbbd8d7805fb5b901207971c13d71a989ba36cda6d362c062da48990c73ac1aa20f54b417a82b794b5dcae14fd8cabe6d418cdf05ed986d9d65ebe3413dbae43286755e1dad13a8e3b7ac7db8195d50fdd5f5f4909226f7d9e6cb25f32f8c6c2f0ddcf0062dec1d0b1de047fac0924ad0fbe37773b820be755fee5b036bc265fbca9cc73328aaec857c1bffbdff3dc5d522058edfd30b315dbb7878754dc6d66b3bc6cc61c034960ec879504342e50fbc21728924a59465a260ae232e3b1b89ede17f474d767a91c31ce8a1f282fad09a48092d26ed9d65e70adc5e22463cbe19a640478e69d84d8cf34b29c79",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            Origin: "http://localhost:4200",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            "If-None-Match": 'W/"2-l9Fw4VUO7kr8CvBlt4zaMCqXZ0w"',
          },
        },
      },
      {
        method: "options",
        url: "http://localhost:3000/campaign/get",
        params: {
          headers: {
            Host: "localhost:3000",
            Connection: "keep-alive",
            Accept: "*/*",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "authorization,content-type",
            Origin: "http://localhost:4200",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
            "Sec-Fetch-Dest": "empty",
            Referer: "http://localhost:4200/",
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
          },
        },
      },
    ];
    res = http.batch(req);
    // Random sleep between 20s and 40s
    sleep(Math.floor(Math.random() * 20 + 20));
  });
}

# THE BOMM BEAUTY ACADEMY — 배포 가이드

## 파일 구성
- index.html — 홈페이지 전체(전면 + 세부 5페이지, 이미지·영상·동적 효과 포함, 단일 파일)
- _redirects — /academy, /curriculum, /caselab, /director, /apply 주소를 index.html로 연결
- _headers — 보안·콘텐츠 타입 헤더
- sitemap.xml / robots.txt / rss.xml — 검색엔진 등록용

## Cloudflare Pages + GitHub 배포
1. GitHub에 새 저장소를 만들고, 이 폴더 안의 파일을 저장소 최상단에 그대로 올립니다.
2. Cloudflare 대시보드 → Workers & Pages → Create → Pages → Connect to Git → 저장소 선택
3. Build 설정
   - Framework preset: None
   - Build command: (비워둠)
   - Build output directory: /
4. Save and Deploy
5. Custom domains → thebommbeautyacademy.com 연결 (www도 추가 후 루트로 리다이렉트 권장)

## 배포 후
- Google Search Console / 네이버 서치어드바이저에 https://thebommbeautyacademy.com/sitemap.xml 제출
- 도메인이 다르면 index.html, sitemap.xml, robots.txt, rss.xml 안의 thebommbeautyacademy.com 을 실제 주소로 바꿔주세요.

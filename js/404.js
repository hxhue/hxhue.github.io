(() => {
    const useUglyURL = false;
    const suffix = useUglyURL ? ".html" : "/";
    const stopLoadingAnimation = () => {
        document.querySelector('#text-404').style.display = '';
        document.querySelector('#loading-404').style.display = 'none';
    };
    let href = window.location.href;
    let hash = href.match(/#.*$/);
    if (hash) {
        hash = hash[0];
        href = href.slice(0, href.length - hash.length);
    }
    if (href.endsWith('.md') || href.endsWith('.markdown')) {
        // 1. markdown
        const translate = (s, map) => Array.from(s).map(ch => map[ch] ?? ch).join('');
        const slugify = (s) => {
            const map = {};

            // Translate characters
            const from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
            const to = "aaaaaeeeeeiiiiooooouuuunc------";
            for (let i = 0, len = from.length; i < len; i++) {
                map[from[i]] = to[i];
            }

            s = translate(s, map);
            s = s.toLowerCase();
            s = s.trim();
            s = s.replace(/\s+/g, '-');         // Replace spaces with -
            s = s.replace(/&/g, '');            // Replace &

            // s = s.replace(/[^\w\-]+/g, '');  // Remove all non-word chars
            // Hugo 不会替换汉字（unicode.IsLetter(r) 对中文汉字判断是 true，对中文标点判断是 false），所以这里也要加上中文字符
            // 2024年9月14日：Hugo 也不会替换 .
            s = s.replace(/[^\u4e00-\u9fff\w\-\.]+/g, '');

            // func isAllowedPathCharacter(s string, i int, r rune) bool {
            //     if r == ' ' {
            //         return false
            //     }
            //     // Check for the most likely first (faster).
            //     isAllowed := unicode.IsLetter(r) || unicode.IsDigit(r)
            //     isAllowed = isAllowed || r == '.' || r == '/' || r == '\\' || r == '_' || r == '#' || r == '+' || r == '~' || r == '-' || r == '@'
            //     isAllowed = isAllowed || unicode.IsMark(r)
            //     isAllowed = isAllowed || (r == '%' && i+2 < len(s) && ishex(s[i+1]) && ishex(s[i+2]))
            //     return isAllowed
            // }
            // func ishex(c byte) bool {
            //     switch {
            //     case '0' <= c && c <= '9':
            //         return true
            //     case 'a' <= c && c <= 'f':
            //         return true
            //     case 'A' <= c && c <= 'F':
            //         return true
            //     }
            //     return false
            // }

            // Remove all non-word latin chars (2024-09-14: and not '.'!)
            for (let i = 0; i < 128; ++i) {
                const ch = String.fromCodePoint(i);
                if (ch.match(/[^\w\-\.]+/)) {
                    map[ch] = '';
                }
            }
            s = translate(s, map);

            // s = s.replace(/\-\-+/g, '-');    // Replace multiple - with single - //! Hugo 不会替换多个 -
            return s;
        };
        const hugoUrlizePath = s => decodeURI(s).split('/').map(slugify).join('/');
        const host = window.location.host;
        const i = href.indexOf(host) + host.length;
        href = href.replace(/\.(md|markdown)$/, '');
        href = href.slice(0, i) + hugoUrlizePath(href.slice(i));
        href += suffix;
    } else if (href.endsWith('/')) {
        // 2. pretty URL
        href = href.replace(/\/$/, suffix);
    } else {
        // 3. 其他
        const a = href.split('/');
        if (!a[a.length - 1].trim().includes('.')) {
            href += suffix;
        }
    }
    if (hash) {
        href += hash;
    }
    if (window.location.href != href) {
        window.location.href = href;
    }
    window.addEventListener('DOMContentLoaded', stopLoadingAnimation);
})()
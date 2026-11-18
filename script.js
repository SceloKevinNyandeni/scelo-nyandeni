const $ = s => document.querySelector(s);
const el = (t, c, x, a) => {
    const e = document.createElement(t);
    if (c) e.className = c;
    if (x != null) e.textContent = x;
    if (a)
        for (const k in a) e.setAttribute(k, a[k]);
    return e
};
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const ph = t => el('span', 'ph', '[placeholder] ' + t);
const safe = u => /^(https?:|mailto:|data:application\/pdf;base64,)/i.test(u) || /^[\w\-./]+$/.test(u);

function link(u, l, opt) {
    if (!u || !safe(u)) return opt ? el('span', 'dm', l + ': none') : ph(l + ' not configured');
    const a = el('a', 'lk', l, {
        href: u
    });
    if (/^https?:/i.test(u)) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.setAttribute('aria-label', l + ' (opens in a new tab)')
    }
    return a
}

function copy(t) {
    const b = el('button', 'mini', 'copy', {
        type: 'button',
        'aria-label': 'Copy ' + t
    });
    b.onclick = async () => {
        try {
            await navigator.clipboard.writeText(t);
            b.textContent = 'copied'
        } catch (e) {
            b.textContent = 'failed'
        }
        setTimeout(() => b.textContent = 'copy', 1500)
    };
    return b
}
const pf = c => {
    const k = c.split(' ')[0];
    return C[k] && !C[k].s ? 'skn ' + c : c
};
const cmd = (c, l) => {
    const b = el('button', 'cmd', l || pf(c), {
        type: 'button'
    });
    b.onclick = () => run(pf(c));
    return b
};
const row = (...n) => {
    const d = el('div', 'row');
    n.forEach(x => d.append(x));
    return d
};
const T = t => el('div', 't', t),
    P = t => el('div', 'p', t);
const kv = (k, v) => {
    const d = el('div', 'kv'),
        s = el('span', 'v');
    s.append(v);
    d.append(el('span', 'k', k), s);
    return d
};
const ul = a => {
    const u = el('ul');
    a.forEach(x => u.append(el('li', null, x)));
    return u
};
const chipsOf = a => {
    const c = el('div', 'chips');
    a.forEach(x => c.append(el('span', 'chip', x)));
    return c
};
const norm = s => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
const findP = q => CFG.projects.find(p => norm(p.id) === norm(q) || norm(p.name).startsWith(norm(q)) && norm(q).length > 2);
const L = CFG.links;

/* ---- terminal ---- */
const out = $('#out'),
    inp = $('#inp'),
    tb = $('#tb'),
    hist = [];
let hi = 0;
const T0 = Date.now();
let cwd = [];
const FS = {
    'about.md': 'skn about',
    'education.md': 'skn education',
    'experience.md': 'skn experience',
    'skills.md': 'skn skills',
    'certifications.md': 'skn certifications',
    'contact.md': 'skn contact',
    'resume.pdf': 'skn resume',
    projects: Object.fromEntries(CFG.projects.map(p => [p.id + '.md', 'skn project ' + p.id]))
};
const prompt = () => 'visitor@portfolio:~' + (cwd.length ? '/' + cwd.join('/') : '') + '$';
const get = st => st.reduce((n, k) => n[k], FS);

function res(p) {
    let st = /^[\/~]/.test(p) ? [] : cwd.slice();
    p = p.replace(/^~/, '').replace(/^\/(home\/visitor\/portfolio)?/, '');
    for (const k of p.split('/')) {
        if (!k || k === '.') continue;
        if (k === '..') {
            st.pop();
            continue
        }
        const n = get(st);
        if (typeof n !== 'object' || !Object.hasOwn(n, k)) return null;
        st.push(k)
    }
    return st
}
const isD = n => typeof n === 'object';
const fpool = f => {
    const i = f.lastIndexOf('/'),
        d = f.slice(0, i + 1),
        st = res(d || '.'),
        n = st && get(st);
    return n && isD(n) ? Object.keys(n).map(k => d + k + (isD(n[k]) ? '/' : '')) : []
};

function emit(n) {
    const b = el('div', 'blk');
    n.forEach(x => b.append(x));
    out.append(b);
    tb.scrollTop = tb.scrollHeight
}

function banner() {
    const r = el('div', 'row');
    ['about', 'education', 'experience', 'projects', 'skills', 'contact'].forEach((c, i) => {
        if (i) r.append(document.createTextNode('\u00b7'));
        r.append(cmd(c))
    });
    return [el('div', 'bn', 'PORTFOLIO OS [Version 1.0.0]'), P('An interactive environment for exploring my work.'), P("Type 'help' to see available commands."), P("Portfolio commands start with 'skn', e.g. skn about."), r]
}
const C = Object.create(null);
const add = (n, d, u, f, s) => C[n] = {
    d,
    u,
    f,
    s
};
add('help', 'Show available commands', 'help', () => {
    const g = s => Object.keys(C).filter(k => !!C[k].s === s).map(k => row(cmd(k), document.createTextNode(C[k].d), el('span', 'dm', '  e.g. ' + pf(C[k].u))));
    return [T('Portfolio commands'), ...g(false), T('Shell commands'), ...g(true), P('Tab completes commands and paths, Up/Down browse history, !! repeats the last command, Ctrl+L clears, Ctrl+C cancels. Click any command.')]
});
add('about', 'Background, interests and goals', 'about', () => {
    const a = CFG.about;
    return [T('About'), ...a.bio.map(P), kv('Strengths', a.strengths.join(', ')), kv('Interests', a.interests || ph('set CFG.about.interests')), kv('Philosophy', a.philosophy || ph('set CFG.about.philosophy')), kv('Career goals', a.goals || ph('set CFG.about.goals'))]
});
add('education', 'Education history', 'education', () => [T('Education'), ...CFG.education.map(e => {
    const d = el('div', 'c2');
    d.append(el('div', 'h', e.qualification + (e.field ? ' - ' + e.field : '')), kv('Institution', e.institution), kv('Dates', e.dates), kv('Coursework', e.coursework.length ? e.coursework.join(', ') : '-'));
    if (e.placeholder) d.append(ph('Example entry. Edit CFG.education.'));
    return d
})]);
add('experience', 'Work experience, newest first', 'experience', () => [T('Experience'), ...CFG.experience.map(e => {
    const d = el('div', 'c2');
    d.append(el('div', 'h', e.role + ' @ ' + e.org), kv('Dates', e.dates), kv('Highlights', ul(e.points)), kv('Tech', e.tech.length ? e.tech.join(', ') : '-'));
    if (e.placeholder) d.append(ph('Example entry. Edit CFG.experience.'));
    return d
})]);
const pRow = p => {
    const d = el('div', 'c2'),
        h = el('div', 'h');
    h.append(cmd('project ' + p.id, p.name), el('span', 'st', ' [' + p.status + ']'));
    d.append(h, P(p.desc), kv('Stack', p.stack.join(', ')), kv('Links', row(link(p.repo, 'repository', 1), link(p.demo, 'live demo', 1))));
    return d
};
add('projects', 'List projects', 'projects', () => CFG.projects.length ? [T('Projects'), ...CFG.projects.map(pRow), P("Run 'skn project <id>' for details, e.g. skn project " + CFG.projects[0].id)] : [P('No projects configured yet.')]);
add('project', 'Details for one project', 'project ' + (CFG.projects[0] || {
    id: 'id'
}).id, a => {
    if (!a[0]) return C.projects.f();
    const p = findP(a.join(' '));
    if (!p) return [P('project not found: ' + a.join(' ')), row(...CFG.projects.map(x => cmd('project ' + x.id)))];
    const r = row(link(p.repo, 'repository', 1), link(p.demo, 'live demo', 1));
    if (p.repo) r.append(copy(p.repo));
    const v = el('button', 'cmd', 'open visual card', {
        type: 'button'
    });
    v.onclick = () => openP(p);
    r.append(v);
    return [T(p.name), P(p.desc), kv('Status', p.status), kv('Stack', p.stack.join(', ')), T('Key features'), ul(p.features), T('Technical decisions'), ul(p.decisions), r]
});
add('skills', 'Technical skills by category', 'skills', () => [T('Skills'), ...CFG.skills.map(g => kv(g.name, g.items.join(' \u00b7 ')))]);
add('certifications', 'Certifications and training', 'certifications', () => [T('Certifications'), ...(CFG.certs.length ? [] : [ph('None listed on the CV yet. Add them to CFG.certs.')]), ...CFG.certs.map(c => {
    const d = el('div', 'c2');
    d.append(el('div', 'h', c.name), kv('Issuer', c.issuer), kv('Date', c.date));
    if (c.placeholder) d.append(ph('Example entry. Edit CFG.certs.'));
    return d
})]);
add('resume', 'Download my CV (PDF)', 'resume', () => {
    if (!L.cv) return [T('Resume'), ph('No CV configured yet. Set CFG.links.cv to a PDF path or URL.')];
    const a = link(L.cv, 'Download CV (PDF)');
    a.setAttribute('download', 'Scelo_Nyandeni_CV.pdf');
    return [T('Resume'), P('My CV is ready to download.'), a]
});
add('github', 'Open my GitHub profile', 'github', () => {
    if (!L.github || !safe(L.github)) return [ph('GitHub not configured. Set CFG.links.github.')];
    window.open(L.github, '_blank', 'noopener,noreferrer');
    return [P('Opening GitHub in a new tab...'), link(L.github, 'GitHub profile')]
});
const cRow = (k, u, l) => {
    const v = el('span');
    v.append(link(u, l || k));
    if (u) v.append(copy(u.replace(/^mailto:/, '')));
    return kv(k, v)
};
const others = () => (L.other || []).map(o => cRow(o.label, o.url));
add('contact', 'Email and professional links', 'contact', () => [T('Contact'), cRow('Email', L.email ? 'mailto:' + L.email : '', 'Email'), cRow('LinkedIn', L.linkedin), cRow('GitHub', L.github), ...others()]);
add('socials', 'Professional social profiles', 'socials', () => [T('Socials'), cRow('LinkedIn', L.linkedin), cRow('GitHub', L.github), ...others()]);
add('whoami', 'Who I am as a developer', 'whoami', () => [P('Scelo Kevin Nyandeni: a junior software developer working across web and backend engineering, currently building PyQGIS automation and Java backends as a software development intern.')]);
add('date', 'Show current date and time', 'date', () => [P(new Date().toLocaleString(undefined, {
    dateStyle: 'full',
    timeStyle: 'medium'
}))]);
add('clear', 'Clear the screen', 'clear', () => {
    out.replaceChildren()
});
add('history', 'Show previous commands', 'history', () => hist.length ? hist.map((h, i) => P((i + 1) + '  ' + h)) : [P('No commands yet.')]);
add('banner', 'Show the welcome banner', 'banner', banner);
add('sudo', 'Run with elevated privileges', 'sudo hire-me', a => a[0] === 'hire-me' ? [P('[sudo] password for visitor: ********'), P('Access granted.'), T('hire-me --now'), P('This developer ships working software and reads the logs. Recruiters and collaborators are very welcome to get in touch.'), row(cmd('contact'), cmd('resume'))] : [P('sudo: try '), cmd('sudo hire-me')]);
const sz = f => {
    try {
        return dispatch(f).reduce((n, x) => n + x.textContent.length, 0)
    } catch (e) {
        return 0
    }
};
add('ls', 'List directory contents', 'ls -l projects', a => {
    const fl = a.filter(x => x[0] === '-').join(''),
        t = a.find(x => x[0] !== '-') || '',
        st = res(t || '.');
    if (!st) return [P("ls: cannot access '" + t + "': No such file or directory")];
    const n = get(st);
    if (!isD(n)) return [P(t)];
    const pre = t ? t.replace(/\/$/, '') + '/' : '';
    const r = Object.keys(n).map(k => {
        const d = isD(n[k]),
            b = el('button', 'cmd', k + (d ? '/' : ''), {
                type: 'button'
            });
        b.onclick = () => run((d ? 'cd ' : 'cat ') + pre + k);
        return fl.includes('l') ? row(el('span', 'dm', (d ? 'drwxr-xr-x' : '-rw-r--r--') + ' visitor ' + String(d ? 4096 : sz(n[k])).padStart(5)), b) : b
    });
    return fl.includes('l') ? r : [row(...r)]
}, 1);
add('cd', 'Change directory', 'cd projects', a => {
    const t = a[0] || '~',
        st = res(t);
    if (!st) return [P('cd: no such file or directory: ' + t)];
    if (!isD(get(st))) return [P('cd: not a directory: ' + t)];
    cwd = st;
    $('#ps').textContent = prompt()
}, 1);
add('pwd', 'Print working directory', 'pwd', () => [P('/home/visitor/portfolio' + (cwd.length ? '/' + cwd.join('/') : ''))], 1);
add('cat', 'Print a file', 'cat about.md', a => a[0] ? a.flatMap(t => {
    const st = res(t);
    if (!st) return [P('cat: ' + t + ': No such file or directory')];
    const n = get(st);
    return isD(n) ? [P('cat: ' + t + ': Is a directory')] : dispatch(n)
}) : [P('cat: missing file operand')], 1);
add('tree', 'Show the directory tree', 'tree', a => {
    const st = res(a[0] || '.');
    if (!st || !isD(get(st))) return [P('tree: ' + (a[0] || '.') + ' [error opening dir]')];
    const tr = (n, p) => Object.keys(n).flatMap((k, i, A) => {
        const l = i === A.length - 1,
            d = isD(n[k]);
        return [p + (l ? '\u2514\u2500\u2500 ' : '\u251c\u2500\u2500 ') + k + (d ? '/' : ''), ...(d ? tr(n[k], p + (l ? '    ' : '\u2502   ')) : [])]
    });
    const ln = tr(get(st), ''),
        d = ln.filter(x => x.endsWith('/')).length;
    return [P('.'), P(ln.join('\n')), P(d + ' directories, ' + (ln.length - d) + ' files')]
}, 1);
add('echo', 'Print text', 'echo hello', (a, r) => [P(r.join(' '))], 1);
add('uname', 'System information', 'uname -a', () => [P('PortfolioOS 1.0.0 portfolio browser simulated')], 1);
add('neofetch', 'System summary', 'neofetch', () => [el('div', 'bn', 'visitor@portfolio'), P('-----------------'), kv('OS', 'Portfolio OS 1.0.0'), kv('Host', 'Your browser'), kv('Shell', 'portfolio-sh'), kv('Uptime', Math.floor((Date.now() - T0) / 60000) + ' min'), kv('Role', CFG.title), kv('Now', CFG.now), kv('Languages', CFG.skills[0].items.join(', ')), kv('Projects', String(CFG.projects.length))], 1);
add('man', 'Manual for a command', 'man ls', a => {
    const c = C[a[0]];
    return !a[0] ? [P('What manual page do you want? e.g. man ls')] : !c ? [P('No manual entry for ' + a[0])] : [T(a[0]), kv('NAME', a[0] + ' - ' + c.d), kv('SYNOPSIS', pf(c.u))]
}, 1);
add('exit', 'Leave the session', 'exit', () => [P('logout'), P('There is no exit from the portfolio. Type help to look around.')], 1);
add('sudo', 'Run as superuser', 'sudo hire-me', a => {
    if (a[0] !== 'hire-me') return [P('sudo: try '), cmd('sudo hire-me')];
    const ls = ['[sudo] password for visitor: ********', 'Authenticating... ok', 'Reading hiring manifest... ok', 'Access granted.'],
        b = el('div'),
        sc = () => {
            tb.scrollTop = tb.scrollHeight
        };
    emit([b]);
    ls.forEach((x, i) => setTimeout(() => {
        b.append(P(x));
        sc()
    }, RM ? 0 : i * 450));
    setTimeout(() => {
        b.append(T('hire-me --now'), P('This developer ships working software and reads the logs. Recruiters and collaborators are very welcome to get in touch.'), row(cmd('contact'), cmd('resume')));
        sc()
    }, RM ? 0 : ls.length * 450)
}, 1);
['date', 'clear', 'history', 'whoami', 'banner'].forEach(k => C[k].s = 1);
const skHelp = () => [el('div', 'bn', 'skn - portfolio CLI for Scelo Kevin Nyandeni'), P('Usage: skn <command> [args]'), T('Commands'), ...Object.keys(C).filter(k => !C[k].s).map(k => row(cmd(k), document.createTextNode(C[k].d), el('span', 'dm', C[k].u !== k ? '  e.g. ' + pf(C[k].u) : ''))), P('Example: skn project ' + (CFG.projects[0] || {
    id: 'id'
}).id)];
add('skn', 'Portfolio CLI: skn <command>', 'skn projects', (a, r) => {
    const k = a[0] || 'help';
    if (k === 'help' || k === '-h' || k === '--help') return skHelp();
    if (!C[k] || C[k].s) return [P('skn: unknown command: ' + k), row(cmd('skn help'))];
    return C[k].f(a.slice(1), r.slice(1))
}, 1);
C.help.s = 1;

function dispatch(line) {
    const w = line.split(/\s+/),
        c = w[0].toLowerCase();
    if (!C[c]) {
        const s = Object.keys(C).filter(k => C[k].s && k[0] === c[0]).slice(0, 4);
        return [P('command not found: ' + c), P("Type 'help' to see available commands."), ...(s.length ? [row(el('span', 'dm', 'Did you mean:'), ...s.map(x => cmd(x)))] : [])]
    }
    if (!C[c].s) return [P('command not found: ' + c), P("Portfolio commands start with 'skn'. Type 'help' to see available commands."), row(el('span', 'dm', 'Did you mean:'), cmd('skn ' + c))];
    return C[c].f(w.slice(1).map(x => x.toLowerCase()), w.slice(1))
}

function run(raw) {
    let line = raw.trim();
    if (line === '!!') line = hist[hist.length - 1] || '';
    const e = el('div', 'echo');
    e.append(el('span', 'pr', prompt()), document.createTextNode(line));
    out.append(e);
    if (!line) {
        emit([P('Nothing to run. Type a command, or try '), row(cmd('help'))]);
        return
    }
    hist.push(line);
    hi = hist.length;
    try {
        const n = dispatch(line);
        if (n) emit(n)
    } catch (err) {
        emit([P('error running ' + line)])
    }
    tb.scrollTop = tb.scrollHeight
}

function complete() {
    const parts = inp.value.replace(/^\s+/, '').split(/\s+/);
    let pool, pre = '',
        frag;
    if (parts.length < 2) {
        pool = Object.keys(C).filter(k => C[k].s).concat('sudo hire-me');
        frag = parts[0].toLowerCase()
    } else {
        const c = parts[0].toLowerCase();
        frag = parts.slice(1).join(' ').toLowerCase();
        pre = parts[0] + ' ';
        pool = c === 'skn' ? (parts.length < 3 ? Object.keys(C).filter(k => !C[k].s).concat('help') : parts[1] === 'project' ? (pre = 'skn project ', frag = parts.slice(2).join(' ').toLowerCase(), CFG.projects.map(p => p.id)) : []) : c === 'project' ? CFG.projects.map(p => p.id) : c === 'sudo' ? ['hire-me'] : ['cd', 'cat', 'ls', 'tree'].includes(c) ? fpool(frag) : []
    }
    const m = pool.filter(x => x.startsWith(frag));
    if (!m.length) return;
    if (m.length === 1) {
        inp.value = pre + m[0] + (m[0].includes(' ') || pre ? '' : ' ');
        return
    }
    let cp = m[0];
    m.forEach(x => {
        while (!x.startsWith(cp)) cp = cp.slice(0, -1)
    });
    if (cp.length > frag.length) {
        inp.value = pre + cp;
        return
    }
    emit([row(...m.map(x => cmd(pre + x, x)))])
}
inp.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const v = inp.value;
        inp.value = '';
        run(v)
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (hi > 0) {
            hi--;
            inp.value = hist[hi]
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (hi < hist.length - 1) {
            hi++;
            inp.value = hist[hi]
        } else {
            hi = hist.length;
            inp.value = ''
        }
    } else if (e.key === 'Tab') {
        e.preventDefault();
        complete()
    } else if (e.ctrlKey && e.key.toLowerCase() === 'c' && !getSelection().toString()) {
        e.preventDefault();
        const x = el('div', 'echo');
        x.append(el('span', 'pr', prompt()), document.createTextNode(inp.value + '^C'));
        out.append(x);
        inp.value = '';
        tb.scrollTop = tb.scrollHeight
    } else if (e.key.toLowerCase() === 'l' && e.ctrlKey) {
        e.preventDefault();
        out.replaceChildren()
    }
});
tb.addEventListener('click', e => {
    if (!getSelection().toString() && !e.target.closest('a,button')) inp.focus({
        preventScroll: true
    })
});

function goTerm() {
    $('#terminal').scrollIntoView({
        behavior: RM ? 'auto' : 'smooth'
    });
    setTimeout(() => inp.focus({
        preventScroll: true
    }), RM ? 0 : 500)
}

/* ---- page ---- */
document.title = CFG.name + ' | ' + CFG.title + ' Portfolio';
$('#lg').textContent = CFG.name.split(' ')[0].toLowerCase();
$('#rl').textContent = '[ ' + CFG.title + ' ]';
$('#nm').textContent = CFG.name;
$('#hl').textContent = CFG.headline;
$('#in').textContent = CFG.intro;
const av = $('#av');
av.textContent = CFG.available ? 'Open to opportunities' : 'Not currently available';
if (!CFG.available) av.className = 'off';
$('#sy').textContent = 'SYSTEM ONLINE / ' + CFG.status;
$('#go').onclick = e => {
    e.preventDefault();
    goTerm()
};
const gh = $('#gh');
if (L.github && safe(L.github)) {
    gh.href = L.github;
    gh.target = '_blank';
    gh.rel = 'noopener noreferrer'
} else gh.onclick = e => {
    e.preventDefault();
    goTerm();
    setTimeout(() => run('skn github'), RM ? 0 : 500)
};
const mb = $('#mbtn'),
    mn = $('#menu');
mb.onclick = () => {
    mb.setAttribute('aria-expanded', mn.classList.toggle('open'))
};
mn.onclick = e => {
    if (e.target.tagName === 'A') {
        mn.classList.remove('open');
        mb.setAttribute('aria-expanded', 'false')
    }
};
['about', 'education', 'experience', 'projects', 'skills', 'contact'].concat('ls', 'neofetch', 'help').forEach(c => {
    const b = el('button', 'chip', pf(c), {
        type: 'button'
    });
    b.onclick = () => {
        run(pf(c));
        inp.focus({
            preventScroll: true
        })
    };
    $('#sh').append(b)
});
const dlg = $('#dlg');
dlg.onclick = e => {
    if (e.target === dlg) dlg.close()
};

function openP(p) {
    const c = $('#dc'),
        r = row(link(p.repo, 'GitHub', 1), link(p.demo, 'Live demo', 1));
    r.style.margin = '16px 0';
    c.replaceChildren(el('h3', null, p.name), el('p', 'st', p.status), el('p', null, p.desc));
    (p.shots || []).forEach(s => c.append(el('img', 'shot', null, {
        src: s,
        alt: p.name + ' screenshot',
        loading: 'lazy'
    })));
    c.append(el('h4', null, 'Key features'), ul(p.features), el('h4', null, 'Technical decisions'), ul(p.decisions), el('h4', null, 'Stack'), chipsOf(p.stack), r);
    const a = el('button', 'btn', 'Explore in terminal', {
        type: 'button'
    });
    a.onclick = () => {
        dlg.close();
        goTerm();
        setTimeout(() => run('skn project ' + p.id), RM ? 0 : 500)
    };
    const b = el('button', 'btn sec', 'Close', {
        type: 'button'
    });
    b.onclick = () => dlg.close();
    const bx = el('div', 'acts');
    bx.append(a, b);
    c.append(bx);
    dlg.showModal()
}
CFG.projects.forEach((p, i) => {
    const a = el('article', 'pc');
    a.append(el('span', 'lb', '[ 0' + (i + 1) + ' ]'), el('h3', null, p.name), el('span', 'chip', p.status), el('p', 'dsc', p.desc), chipsOf(p.stack), row(link(p.repo, 'GitHub', 1), link(p.demo, 'Live demo', 1)));
    const b = el('button', 'btn sec', 'View Details', {
        type: 'button'
    });
    b.onclick = () => openP(p);
    a.append(b);
    $('#pg').append(a)
});
CFG.skills.forEach((g, i) => {
    const a = el('div', 'pc');
    a.append(el('span', 'lb', '[ 0' + (i + 1) + ' ]'), el('h3', null, g.name), chipsOf(g.items));
    $('#sg').append(a)
});

function tl(h, items, f) {
    items.forEach(x => {
        const i = el('div', 'ti');
        f(i, x);
        if (x.placeholder) i.append(ph('Example entry. Replace it in the config.'));
        $(h).append(i)
    })
}
tl('#xt', CFG.experience, (i, x) => i.append(el('span', 'lb', x.dates), el('h3', null, x.role + ' / ' + x.org), ul(x.points), chipsOf(x.tech)));
tl('#et', CFG.education, (i, x) => i.append(el('span', 'lb', x.dates), el('h3', null, x.qualification + (x.field ? ' / ' + x.field : '')), el('p', 'dsc', x.institution), chipsOf(x.coursework)));
[
    ['Resume', L.cv, 'Download CV (PDF)'],
    ['Email', L.email ? 'mailto:' + L.email : '', L.email || 'Email'],
    ['LinkedIn', L.linkedin, 'LinkedIn profile'],
    ['GitHub', L.github, 'GitHub profile']
].concat((L.other || []).map(o => [o.label, o.url, o.label])).forEach(([k, u, l]) => {
    const d = el('div', 'ct');
    d.style.borderBottom = '1px solid var(--line)';
    d.append(el('span', 'dm', k));
    const a = link(u, l);
    if (k === 'Resume' && u) a.setAttribute('download', 'Scelo_Nyandeni_CV.pdf');
    d.append(a);
    $('#cg').append(d)
});
$('#ft').textContent = '\u00a9 ' + new Date().getFullYear() + ' ' + CFG.name + '. Built as a simulated terminal: no real commands are executed.';
const fab = $('#fab');
fab.onclick = goTerm;
new IntersectionObserver(([e]) => {
    fab.hidden = e.isIntersecting || scrollY < 400
}).observe($('#terminal'));
addEventListener('scroll', () => {
    if (scrollY < 400) fab.hidden = true
}, {
    passive: true
});

/* ---- welcome ---- */
let first = true;
try {
    first = !localStorage.getItem('po-seen');
    localStorage.setItem('po-seen', '1')
} catch (e) {}
emit(banner());
if (first) emit([P('Welcome, visitor. Portfolio commands start with skn (e.g. skn about). Click a shortcut above or type '), row(cmd('help'))]);
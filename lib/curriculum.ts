import type { World } from "./types";

/** Score (0..1) needed to clear a world. */
export const passThreshold = 0.7;

/**
 * FoundrQuest curriculum. Thirteen worlds tracing the real startup lifecycle,
 * from "what is a share" to "the exit". World 10 (The Crossroads) branches into
 * a player-chosen growth path. Content is grounded in the source material and
 * enriched with standard founder concepts (vesting, 83(b), NRR, AARRR, etc).
 */
export const WORLDS: World[] = [
  // ----------------------------------------------------------------- 0
  {
    id: "equity-basics",
    index: 0,
    title: "The Foundry",
    subtitle: "Bricks, not pies",
    objective: "Understand that a company is shares (bricks), not a pie of percentages.",
    icon: "🧱",
    accent: "gold",
    lessons: [
      {
        id: "bricks-not-pies",
        title: "Bricks, not pies",
        blocks: [
          { kind: "p", text: "Founders imagine their company as a pie they slice up and hand pieces to investors. That is the wrong mental model. Most startups are C-corporations, and a C-corp is made of bricks — shares of stock — not percentages." },
          { kind: "p", text: "Say two founders start a company and each takes 10 shares. The company has 20 shares total, so each owns 50%. When an investor arrives, the founders do NOT give away their own shares. Instead the company CREATES brand-new shares and sells them to the investor." },
          { kind: "callout", tone: "key", title: "The key move", text: "If the company creates 5 new shares for an investor, total shares become 25. Each founder still holds 10 shares — but 10 of 25 is now 40%, not 50%. Their share count never changed; their percentage did. That is dilution." },
          { kind: "compare", left: { title: "Pie (LLC)", items: ["Ownership = percentages", "Hard to add many investors", "Partnership-style"] }, right: { title: "Bricks (C-corp)", items: ["Ownership = number of shares", "Easy to issue new shares each round", "Standard for venture startups"] } },
          { kind: "p", text: "Why does selling your own shares not work? Because if you personally sold a founder share to an investor, that money goes to you and you owe taxes on it — and no cash reaches the company. The company needs the cash, so the company issues new shares." },
        ],
      },
    ],
    questions: [
      { id: "eb1", type: "mcq", prompt: "When an investor invests in a startup, where do their shares usually come from?", options: ["The founders sell some of their own shares", "The company issues brand-new shares", "Shares are taken proportionally from everyone", "No new shares — just a percentage is assigned"], correct: 1, explanation: "The company creates new shares and sells them to the investor, injecting cash into the company. Founders keep their existing share count; their percentage drops.", concept: "issuing shares" },
      { id: "eb2", type: "mcq", prompt: "Two founders own 10 shares each (20 total). The company issues 5 new shares to an investor. What % does each founder now own?", options: ["50%", "45%", "40%", "33%"], correct: 2, explanation: "Total is now 25 shares. Each founder still holds 10 → 10/25 = 40%. The investor holds 5/25 = 20%.", concept: "dilution math" },
      { id: "eb3", type: "truefalse", prompt: "Dilution means the founder's number of shares goes down.", options: ["True", "False"], correct: 1, explanation: "False. In dilution the share COUNT stays the same; the percentage drops because new shares were created and added to the total.", concept: "dilution" },
      { id: "eb4", type: "mcq", prompt: "Why is a C-corporation preferred over an LLC for a venture-backed startup?", options: ["LLCs pay more tax", "C-corps deal in shares, making it easy to add multiple investor rounds", "LLCs cannot have employees", "C-corps are cheaper to register"], correct: 1, explanation: "An LLC splits ownership in percentages (a pie), which is clumsy for stacking multiple funding rounds. A C-corp deals in shares (bricks), so it can keep issuing new shares cleanly.", concept: "c-corp vs llc" },
      { id: "eb5", type: "mcq", prompt: "Why don't founders just sell their own shares to an investor instead of issuing new ones?", options: ["It's illegal", "The cash would go to the founder (and be taxed), not into the company", "Investors refuse used shares", "It dilutes the investor"], correct: 1, explanation: "Selling personal shares routes the money to the founder personally (a taxable event) and puts no capital into the company. The company needs the cash, so it issues new shares.", concept: "primary vs secondary" },
      { id: "eb6", type: "mcq", prompt: "Real companies are usually founded with how many shares?", options: ["Exactly 100", "10 — one per founder", "Millions (e.g. 10 million)", "It doesn't matter, percentages are used"], correct: 2, explanation: "Companies authorize millions of shares (often 10M) so equity can be split finely — you can't hand someone half a share. The 10-share example is just for teaching.", concept: "authorized shares" },
    ],
  },

  // ----------------------------------------------------------------- 1
  {
    id: "company-formation",
    index: 1,
    title: "City Hall",
    subtitle: "Incorporate in the USA",
    objective: "Form a Delaware C-corp, name it, issue founder stock, and file your 83(b).",
    icon: "🏛️",
    accent: "sky",
    lessons: [
      {
        id: "delaware",
        title: "Why Delaware?",
        blocks: [
          { kind: "p", text: "Most US venture-backed startups incorporate as a Delaware C-corporation — even if no one lives in Delaware. Investors expect it: Delaware has a specialized business court (Court of Chancery), well-tested corporate law, and standard documents every VC's lawyer already knows." },
          { kind: "callout", tone: "info", title: "When an LLC is fine", text: "If you're building a lifestyle business, an agency, or a YouTube channel — something you'll keep and run for profit, not raise VC for and exit — an LLC is simpler and cheaper. Raise VC only if you're a high-growth, large-market (think $100M+) company." },
          { kind: "list", items: ["File a Certificate of Incorporation with the Delaware Secretary of State", "Appoint a registered agent with a Delaware address", "Adopt bylaws and elect initial directors", "Get an EIN (tax ID) from the IRS", "Issue founder stock and sign stock purchase agreements", "Open a business bank account"] },
          { kind: "p", text: "Tools like Clerky, Stripe Atlas, and Firstbase automate the whole packet for a few hundred dollars so you don't pay a lawyer thousands for boilerplate." },
        ],
      },
      {
        id: "naming",
        title: "Naming your company",
        blocks: [
          { kind: "p", text: "A US corporation's legal name needs a corporate designator — 'Inc.' or 'Corp.' (e.g. 'Acme, Inc.'). Before you commit: check the name is available in your state of incorporation, run a trademark search (USPTO), and confirm the .com domain (or a credible alternative) is gettable." },
          { kind: "callout", tone: "warn", title: "Don't skip the trademark check", text: "A name that's already trademarked in your category can force an expensive rebrand later. Check before you print business cards." },
        ],
      },
      {
        id: "founder-stock-83b",
        title: "Founder stock, vesting & the 83(b)",
        blocks: [
          { kind: "p", text: "When you issue yourself founder stock, you usually put it on a VESTING schedule — classically 4 years with a 1-year cliff. The cliff means you earn nothing until you've been there a year; then 25% vests at once, and the rest vests monthly. Vesting protects co-founders from each other: if someone leaves in month 3, they don't walk away with a quarter of the company." },
          { kind: "formula", label: "Par value", formula: "shares × par value (e.g. $0.0001) = price you pay for founder stock", note: "Founder stock is bought at par — fractions of a cent per share — so it's nearly free at incorporation, when the company is worth ~nothing." },
          { kind: "callout", tone: "key", title: "File your 83(b) within 30 days", text: "An 83(b) election tells the IRS to tax your restricted stock NOW (when it's worth almost nothing) instead of as it vests (when it could be worth a fortune). You have only 30 days from the grant to file — miss it and you can owe taxes on the gain every time shares vest. This is one of the most expensive mistakes a founder can make." },
        ],
      },
    ],
    questions: [
      { id: "cf1", type: "mcq", prompt: "What entity type do most US venture-backed startups choose?", options: ["California LLC", "Delaware C-corporation", "Nevada S-corp", "Sole proprietorship"], correct: 1, explanation: "Delaware C-corp is the standard. VCs expect it — Delaware's corporate law and Court of Chancery are well-tested and every investor's lawyer knows the documents.", concept: "delaware c-corp" },
      { id: "cf2", type: "mcq", prompt: "You have founder restricted stock that vests over 4 years. To avoid a nasty future tax bill, you should file an 83(b) election within…", options: ["30 days of the grant", "1 year", "Before your first funding round", "Before the company is profitable"], correct: 0, explanation: "The 83(b) must be filed within 30 days of the grant. It elects to be taxed now (stock ~worthless) rather than as it vests (potentially valuable). Missing the window is a costly error.", concept: "83(b) election" },
      { id: "cf3", type: "mcq", prompt: "What does a '1-year cliff' on a vesting schedule mean?", options: ["You lose all stock after 1 year", "You earn no vested shares until you've stayed 1 year, then 25% vests at once", "Vesting stops after 1 year", "Stock doubles after 1 year"], correct: 1, explanation: "A 1-year cliff means nothing vests in the first year; reach the 1-year mark and a full year's worth (typically 25%) vests at once, then it continues monthly. It protects the cap table from early quitters.", concept: "vesting cliff" },
      { id: "cf4", type: "mcq", prompt: "A US corporation's legal name must include…", options: ["The founder's name", "A corporate designator like 'Inc.' or 'Corp.'", "The word 'Startup'", "A trademark symbol"], correct: 1, explanation: "Legal corporate names need a designator such as Inc., Corp., or Incorporated. You should also clear name availability, trademarks, and a domain before committing.", concept: "company naming" },
      { id: "cf5", type: "truefalse", prompt: "An LLC is the right choice if you intend to raise multiple rounds of venture capital and exit.", options: ["True", "False"], correct: 1, explanation: "False. LLCs use percentage ownership which is clumsy for stacking VC rounds. Raise-and-exit startups use a Delaware C-corp; LLCs suit lifestyle/profit businesses.", concept: "entity choice" },
      { id: "cf6", type: "mcq", prompt: "Why do founders buy their stock at 'par value' (e.g. $0.0001/share)?", options: ["It's a legal cap", "At incorporation the company is worth ~nothing, so stock is nearly free and there's no taxable gain", "Par value is set by the IRS", "To inflate the valuation"], correct: 1, explanation: "At founding the company has essentially no value, so founder shares are priced at par — fractions of a cent — making them almost free and avoiding an upfront tax hit.", concept: "par value" },
      { id: "cf7", type: "mcq", prompt: "What is a registered agent?", options: ["The lead investor", "A person/service with an in-state address that receives legal documents for the company", "The company's lawyer", "The founder who signs the incorporation"], correct: 1, explanation: "A registered agent is required to have a physical address in the state of incorporation (e.g. Delaware) to receive official and legal mail on the company's behalf.", concept: "registered agent" },
    ],
  },

  // ----------------------------------------------------------------- 2
  {
    id: "valuation",
    index: 2,
    title: "The Oracle",
    subtitle: "What is it worth?",
    objective: "Compute pre/post-money valuation and understand the 15–20% round standard.",
    icon: "🔮",
    accent: "quest",
    lessons: [
      {
        id: "pre-post",
        title: "Pre-money and post-money",
        blocks: [
          { kind: "p", text: "At the early stage, nobody really 'knows' what a startup is worth. Investors don't think in valuation first — they think in equity: how much of the company do I get for my money? Valuation is just the number we reverse-engineer from that." },
          { kind: "formula", label: "Post-money", formula: "post-money = pre-money + investment", note: "Pre-money is what the company is worth before the new cash. Post-money assumes the new cash is already in." },
          { kind: "formula", label: "Investor ownership", formula: "investor % = investment ÷ post-money valuation" },
          { kind: "p", text: "Example: Peter Thiel put $500,000 into Facebook for ~10%. If $500k = 10%, the post-money valuation is $5M, and the pre-money was $4.5M. The company creates new shares for Thiel at that price; everyone else is diluted." },
        ],
      },
      {
        id: "standard",
        title: "The 15–20% standard",
        blocks: [
          { kind: "p", text: "At pre-seed and seed, your financial forecasts mean almost nothing — every founder thinks they're a unicorn. So instead of fighting over a spreadsheet number, the market runs on a standard: most early rounds translate to investors taking 15–20% of the company. The valuation is just back-calculated from the raise and that target." },
          { kind: "callout", tone: "key", title: "The counterintuitive part", text: "Raise more money → higher valuation. If you raise $900k for 20%, your post-money is $4.5M. Raise only $450k and investors STILL want ~15–20%, so your valuation is roughly halved. A founder who can raise a $2M pre-seed is signaling a more valuable company than one raising $900k." },
          { kind: "formula", label: "Reverse-engineer the valuation", formula: "post-money = investment ÷ target equity %", note: "$900k ÷ 20% = $4.5M post-money → $3.6M pre-money." },
        ],
      },
      {
        id: "409a",
        title: "409A ≠ fundraising valuation",
        blocks: [
          { kind: "compare", left: { title: "Fundraising valuation", items: ["Negotiated with investors", "Forward-looking / potential", "Sets the price of the round", "Like betting odds: risk vs reward"] }, right: { title: "409A valuation", items: ["Independent appraisal", "Sets the strike price for stock options", "Usually LOWER than the round price", "Required for tax compliance"] } },
          { kind: "p", text: "A 409A is a formal appraisal used to set the fair-market strike price for employee options. It's a separate, more conservative number than the valuation you negotiate with VCs." },
        ],
      },
    ],
    questions: [
      { id: "v1", type: "mcq", prompt: "An investor puts in $500k for 10% of the company. What is the POST-money valuation?", options: ["$500k", "$4.5M", "$5M", "$50M"], correct: 2, explanation: "investor % = investment ÷ post-money → 10% = $500k ÷ post → post = $5M. Pre-money was $4.5M.", concept: "post-money" },
      { id: "v2", type: "mcq", prompt: "If post-money is $5M and the investment was $500k, what is the pre-money valuation?", options: ["$5.5M", "$5M", "$4.5M", "$500k"], correct: 2, explanation: "pre-money = post-money − investment = $5M − $0.5M = $4.5M.", concept: "pre-money" },
      { id: "v3", type: "mcq", prompt: "You raise $900k and the standard pre-seed equity is 20%. What's your post-money valuation?", options: ["$1.8M", "$4.5M", "$9M", "$18M"], correct: 1, explanation: "post-money = investment ÷ equity = $900k ÷ 0.20 = $4.5M. Pre-money = $3.6M.", concept: "round standard" },
      { id: "v4", type: "truefalse", prompt: "If you raise half as much money but investors still want 15–20%, your valuation is roughly halved.", options: ["True", "False"], correct: 0, explanation: "True — and it's counterintuitive. The equity % is the fixed standard at early stage, so a smaller raise reverse-engineers to a smaller valuation. More raise ⇒ higher valuation.", concept: "raise-size effect" },
      { id: "v5", type: "mcq", prompt: "At pre-seed, why do investors lean on a 15–20% standard instead of your financial model?", options: ["They're lazy", "Early forecasts are basically meaningless — every founder claims unicorn potential", "It's a legal requirement", "Models are illegal to show"], correct: 1, explanation: "With little or no revenue, projections can't be trusted, so the market uses a standard equity band and back-calculates the valuation.", concept: "why standard" },
      { id: "v6", type: "mcq", prompt: "A 409A valuation is primarily used to…", options: ["Set the price VCs pay in a round", "Set the fair-market strike price for employee stock options", "Calculate founder taxes", "Value the company for acquisition"], correct: 1, explanation: "A 409A is an independent appraisal that sets the option strike price for tax purposes. It's separate from — and usually lower than — the negotiated fundraising valuation.", concept: "409a" },
      { id: "v7", type: "mcq", prompt: "A 'down round' is a financing where…", options: ["The company raises less paperwork", "The per-share price is LOWER than the previous round", "Only insiders invest", "The valuation stays flat"], correct: 1, explanation: "A down round prices shares below the prior round (valuation dropped). It triggers anti-dilution protection, signals trouble, and heavily dilutes founders/common holders.", concept: "down round" },
    ],
  },

  // ----------------------------------------------------------------- 3
  {
    id: "funding-instruments",
    index: 3,
    title: "The Bridge",
    subtitle: "Notes & SAFEs",
    objective: "Master convertible notes and SAFEs — the bridge instruments to a priced round.",
    icon: "🌉",
    accent: "gold",
    lessons: [
      {
        id: "convertible-notes",
        title: "Convertible notes",
        blocks: [
          { kind: "p", text: "A priced equity round is expensive and slow ($30k+ in legal fees) and needs a hard valuation. Convertible notes let you skip that fight. A convertible note is a LOAN designed to convert into shares later — it has a maturity date, an interest rate, and sits as debt on the balance sheet." },
          { kind: "p", text: "Instead of agreeing a valuation now, the note says: 'we'll convert at the NEXT priced round's valuation.' Early investors take more risk, so they get rewarded with a DISCOUNT (e.g. 20% off the next round's price) and/or a CAP (a maximum valuation at which they convert)." },
          { kind: "callout", tone: "key", title: "Cap vs discount", text: "At conversion the investor gets the BETTER (cheaper) of the two: the discounted price, or the cap price. A $5M cap means they convert as if the company were worth at most $5M — even if the new round values it at $50M." },
          { kind: "callout", tone: "warn", title: "The maturity-date trap", text: "Because a note is a loan, if no new round happens before the maturity date, investors can technically demand their money back — exactly when a struggling company can least afford it. They may also convert at the cap or extend. None of these are fun for founders." },
        ],
      },
      {
        id: "safes",
        title: "SAFEs",
        blocks: [
          { kind: "p", text: "The SAFE (Simple Agreement for Future Equity), invented by Y Combinator in 2013, fixes the note's worst flaw. It's an agreement for future equity — NOT a loan. So it has no maturity date and no interest, and the company can never be forced to pay it back." },
          { kind: "compare", left: { title: "Convertible note", items: ["Is a loan (debt)", "Has maturity date + interest", "Can be 'called' back", "Often has cap AND discount"] }, right: { title: "SAFE", items: ["Not a loan", "No maturity, no interest", "Cannot be called back", "Usually cap OR discount", "Free YC template — saves legal fees"] } },
          { kind: "callout", tone: "info", title: "Post-money vs pre-money SAFE", text: "The modern (2018+) YC SAFE is a POST-money SAFE: the cap is measured after all SAFEs convert, so founders can calculate their exact dilution upfront. Older pre-money SAFEs hid how much stacking SAFEs would dilute you." },
          { kind: "callout", tone: "warn", title: "Both are bridges, not the destination", text: "Notes and SAFEs are designed to convert at a FUTURE priced round. If that round never comes, the instrument has to resolve awkwardly. Never treat them as the endgame." },
        ],
      },
    ],
    questions: [
      { id: "fi1", type: "mcq", prompt: "A convertible note is fundamentally a…", options: ["Type of equity", "Loan designed to convert into shares", "Grant that never repays", "Government subsidy"], correct: 1, explanation: "A convertible note is debt: it has a maturity date and interest, and converts into equity at a later priced round.", concept: "convertible note" },
      { id: "fi2", type: "mcq", prompt: "A note has a 20% discount and a $5M cap. The next round prices the company at $50M. How does the investor convert?", options: ["At $50M", "At the 20% discount ($40M)", "At the $5M cap", "They get cash back"], correct: 2, explanation: "The investor gets the cheaper outcome. The $5M cap is far better than a 20% discount off $50M, so they convert as if the company were worth $5M.", concept: "cap vs discount" },
      { id: "fi3", type: "mcq", prompt: "The biggest risk of a convertible note for founders is…", options: ["The interest rate", "The maturity date — if no round happens, investors can demand repayment", "The discount", "Converting too early"], correct: 1, explanation: "If the company hits maturity with no new round, the loan can be called for repayment (or converted at the cap / extended) — dangerous for a cash-strapped startup.", concept: "maturity trap" },
      { id: "fi4", type: "truefalse", prompt: "A SAFE has a maturity date and accrues interest just like a convertible note.", options: ["True", "False"], correct: 1, explanation: "False. A SAFE is not a loan — no maturity date, no interest, and it can't be called back. That's its main advantage over a note.", concept: "safe vs note" },
      { id: "fi5", type: "mcq", prompt: "Who created the SAFE and why?", options: ["The SEC, for regulation", "Y Combinator (2013), as a faster/cheaper alternative to convertible notes", "A law firm, to bill more", "Sequoia, for late-stage deals"], correct: 1, explanation: "Y Combinator introduced the SAFE in 2013 — a free template that keeps the speed of a note but drops the loan baggage.", concept: "safe origin" },
      { id: "fi6", type: "mcq", prompt: "Why are notes and SAFEs called 'bridge' instruments?", options: ["They bridge two co-founders", "They're designed to convert at a future priced round — they're not the endgame", "They bridge debt and grants", "They only work between accelerators"], correct: 1, explanation: "Both convert at a later valuation round. They bridge a company to its next priced round and must eventually resolve there.", concept: "bridge funding" },
      { id: "fi7", type: "mcq", prompt: "A post-money SAFE (2018+ YC) is better for founders' planning because…", options: ["It has no cap", "The cap is measured after all SAFEs convert, so dilution is calculable upfront", "It pays interest", "It never converts"], correct: 1, explanation: "Post-money SAFEs fix the ownership target after all SAFEs convert, letting founders see exactly how much they'll be diluted before signing.", concept: "post-money safe" },
    ],
  },

  // ----------------------------------------------------------------- 4
  {
    id: "shares-and-options",
    index: 4,
    title: "The Vault",
    subtitle: "Shares, options & rights",
    objective: "Tell common from preferred, value stock options, and decode investor rights.",
    icon: "🗝️",
    accent: "sky",
    lessons: [
      {
        id: "common-preferred",
        title: "Common vs preferred shares",
        blocks: [
          { kind: "p", text: "A COMMON share is the plain-vanilla share founders and employees hold: typically one vote, one slice of profits. A PREFERRED share is any share with an exception to the normal rules — special voting, dividends, or downside protection. Investors usually negotiate preferred shares." },
          { kind: "callout", tone: "key", title: "Liquidation preference", text: "The most important preferred right. A '1x liquidation preference' means that if the company is sold or liquidated, those investors get their money back FIRST (1× their investment) before common shareholders see a cent. A 2x preference doubles that." },
          { kind: "p", text: "Companies can stack multiple GENERATIONS of preferred (Series A, B, C…), each with its own rules, layered on top of each other. It gets complicated fast — which is part of why priced rounds are expensive." },
          { kind: "callout", tone: "info", title: "Control ≠ ownership", text: "Mark Zuckerberg kept control of Facebook by giving investors shares with NO voting rights, while keeping super-voting shares himself. Control comes from voting rights and the board — not from owning the biggest percentage." },
        ],
      },
      {
        id: "options",
        title: "Stock options & the strike price",
        blocks: [
          { kind: "p", text: "Startups can't pay top salaries, so they grant employees stock OPTIONS — the right to BUY a set number of shares later at a fixed price (the STRIKE PRICE), usually set at the 409A fair-market value on the grant date." },
          { kind: "p", text: "Giving someone shares outright would create taxable income immediately. An option doesn't — it only has value if the company grows above the strike price. Then the employee can buy low and the shares are worth more." },
          { kind: "formula", label: "Option payoff", formula: "(sale price − strike price) × shares", note: "Strike $1, IPO price $38, 30,000 options → ($38−$1)×30,000 ≈ $1.1M." },
        ],
      },
      {
        id: "pool-and-rights",
        title: "Option pools & investor rights",
        blocks: [
          { kind: "callout", tone: "warn", title: "The option pool shuffle", text: "Investors usually require you to create an EMPLOYEE OPTION POOL (ESOP) BEFORE they invest — so the dilution from future hires comes out of the FOUNDERS' slice, not theirs. Adding a pool pre-money quietly lowers your effective valuation." },
          { kind: "list", items: [
            "Pro-rata rights: investors can buy more in future rounds to keep their %.",
            "Anti-dilution: protects an investor if a later round is priced lower (a 'down round'). Full-ratchet is harsh; weighted-average is the common, gentler form.",
            "Right of first refusal (ROFR): the company/investors can buy shares before you sell to an outsider.",
            "Drag-along: majority can force minority holders to join a sale. Tag-along: minority can join a sale on the same terms.",
            "Fully-diluted shares: the total share count counting all options, warrants, and convertibles as if exercised — the honest denominator for ownership %.",
          ] },
        ],
      },
    ],
    questions: [
      { id: "so1", type: "mcq", prompt: "What makes a share 'preferred' rather than 'common'?", options: ["It's worth more money", "It has an exception to the normal rules (special voting, dividends, or downside protection)", "Only founders can hold it", "It pays no dividends"], correct: 1, explanation: "A preferred share is any share that deviates from the standard one-vote/one-profit-slice rules. Investors typically negotiate preferred shares.", concept: "common vs preferred" },
      { id: "so2", type: "mcq", prompt: "A 1x liquidation preference means that on a sale/liquidation, those investors…", options: ["Get 1% of the proceeds", "Get their original investment back before common shareholders get anything", "Vote first", "Get 1 extra share"], correct: 1, explanation: "Liquidation preference puts those investors first in line to recover (1× here) their money before common holders are paid.", concept: "liquidation preference" },
      { id: "so3", type: "mcq", prompt: "A stock option gives an employee…", options: ["Free shares immediately", "The right to BUY shares later at a fixed strike price", "A cash bonus", "A board seat"], correct: 1, explanation: "An option is the right (not obligation) to buy shares at the strike price set at grant. It's valuable only if the company's value rises above that strike.", concept: "stock options" },
      { id: "so4", type: "mcq", prompt: "Strike price $1, the company IPOs at $38, employee holds 30,000 options. Roughly what's the gross payoff?", options: ["$30,000", "$38,000", "$1.1M", "$1.14M minus nothing"], correct: 2, explanation: "($38 − $1) × 30,000 = $37 × 30,000 ≈ $1.11M. They buy at $1 and sell at $38.", concept: "option payoff" },
      { id: "so5", type: "truefalse", prompt: "Owning the largest percentage of shares is the only way to control a company.", options: ["True", "False"], correct: 1, explanation: "False. Control comes from voting rights and the board of directors. Zuckerberg kept control of Facebook via super-voting shares and non-voting investor shares, not by owning the most equity.", concept: "control vs ownership" },
      { id: "so6", type: "mcq", prompt: "The 'option pool shuffle' refers to investors requiring the option pool to be created…", options: ["After they invest, diluting everyone", "Before they invest, so future-hire dilution hits founders, not investors", "Only at exit", "Never — pools are illegal pre-investment"], correct: 1, explanation: "By insisting the pool be added pre-money, investors push the dilution of future hires onto the founders and effectively lower the real valuation.", concept: "option pool shuffle" },
      { id: "so7", type: "mcq", prompt: "Anti-dilution protection kicks in primarily to protect investors during a…", options: ["Up round", "Down round (a later round priced lower)", "IPO", "Stock split"], correct: 1, explanation: "Anti-dilution (full-ratchet or the milder weighted-average) compensates investors when a future round is priced below what they paid.", concept: "anti-dilution" },
      { id: "so8", type: "mcq", prompt: "'Drag-along' rights mean…", options: ["Minority holders can join a sale on equal terms", "The majority can force minority holders to join a company sale", "Investors can drag out due diligence", "Founders can delay vesting"], correct: 1, explanation: "Drag-along lets a majority compel minority shareholders into a sale (so one holdout can't block it). Tag-along is the reverse — minority can join a sale.", concept: "drag/tag-along" },
      { id: "so9", type: "mcq", prompt: "Pro-rata rights let an existing investor…", options: ["Force the company to buy back their shares", "Invest more in future rounds to maintain their ownership %", "Veto new hires", "Convert to common shares"], correct: 1, explanation: "Pro-rata rights give an investor the option (not obligation) to put in more money in later rounds to avoid being diluted below their current percentage.", concept: "pro-rata" },
      { id: "so10", type: "mcq", prompt: "Which anti-dilution method is the market-standard, more founder-friendly one?", options: ["Full ratchet", "Broad-based weighted average", "Par-value reset", "Liquidation preference"], correct: 1, explanation: "Broad-based weighted average adjusts only partially based on the size and price of the down round. Full ratchet re-prices the investor's entire stake to the new low — much harsher on founders.", concept: "anti-dilution methods" },
    ],
  },

  // ----------------------------------------------------------------- 5
  {
    id: "the-pitch",
    index: 5,
    title: "The Arena",
    subtitle: "Pitch 100 investors",
    objective: "Run the pitch funnel: stages, warm intros, the email deck, and reading 'nice nos'.",
    icon: "⚔️",
    accent: "ember",
    lessons: [
      {
        id: "stages",
        title: "Know your stage",
        blocks: [
          { kind: "p", text: "Match your stage to the right investor and raise enough to reach the NEXT fundable milestone — don't get stranded between stages, where raising is hardest." },
          { kind: "compare", left: { title: "Idea stage", items: ["Just an idea/vision", "Can't yet build it alone", "Funding: friends & family, grants"] }, right: { title: "Pre-seed", items: ["Team + idea + can ship the product", "Some early validation", "Funding: angels, accelerators, micro-VCs"] } },
          { kind: "callout", tone: "key", title: "The funnel rule of thumb", text: "For roughly every $500,000 you want to raise, plan to pitch about 100 investors. Pitching is brutal — you'll get a lot of nos. That's the job." },
        ],
      },
      {
        id: "warm-intros",
        title: "Warm intros & the email deck",
        blocks: [
          { kind: "callout", tone: "warn", title: "Never cold-email investors", text: "Cold-emailing or blasting your deck is a rookie move. Start with people you know directly, then move to people you can get a WARM intro to. Ask a mutual contact for the intro (give them a one-paragraph blurb to forward)." },
          { kind: "list", items: [
            "Get the warm intro → ask permission before sending your deck.",
            "Send an 'email deck' — self-explanatory, readable in 3–5 minutes with no narration.",
            "Use a tracking platform so you can see when an investor opens it.",
            "Nobody signs an NDA to read your deck — asking for one is a rookie move.",
            "Keep a CRM/log of every conversation; you'll repeat this dozens of times.",
          ] },
          { kind: "p", text: "A meeting is ~45 min: 5 min small talk, ~15 min walking through an extended deck, then Q&A. Try to leave with a clear next step — know whose court the ball is in." },
        ],
      },
      {
        id: "nice-nos",
        title: "Reading the 'nice no'",
        blocks: [
          { kind: "p", text: "'We'd love to see more traction first' or 'come back when you've hit X' is usually a polite NO. Don't despair — ask what the specific milestone is, log it, and ask to send investor updates. Investors who passed have come back in after seeing progress in updates." },
          { kind: "callout", tone: "info", title: "Lead vs follow investors", text: "A LEAD investor sets the terms and runs diligence; FOLLOWERS take the same terms once a lead commits. The hardest investor to find is the first one — once you have a lead, others fall in line." },
        ],
      },
    ],
    questions: [
      { id: "p1", type: "mcq", prompt: "Roughly how many investors should you expect to pitch per $500k you want to raise?", options: ["About 10", "About 100", "About 1,000", "Just 3–4 good ones"], correct: 1, explanation: "Rule of thumb: ~100 investors pitched per $500k raised. Expect a lot of nos — the funnel is wide.", concept: "pitch funnel" },
      { id: "p2", type: "truefalse", prompt: "Cold-emailing investors and blasting your deck to a big list is an effective fundraising strategy.", options: ["True", "False"], correct: 1, explanation: "False — it's a rookie move. Start with people you know, then warm intros via mutual contacts. Always ask before sending the deck.", concept: "warm intros" },
      { id: "p3", type: "mcq", prompt: "An 'email deck' should be…", options: ["100+ slides with appendices", "Self-explanatory and readable in 3–5 minutes without narration", "Only sent after an NDA", "A live presentation only"], correct: 1, explanation: "The email deck must stand on its own — clear in a few minutes with no one explaining it. No NDA needed; asking for one is a rookie move.", concept: "email deck" },
      { id: "p4", type: "mcq", prompt: "An investor says 'come back when you have more traction.' This usually means…", options: ["A definite yes soon", "A polite no — but ask what the milestone is and keep them on updates", "They want an NDA", "They want to lead the round"], correct: 1, explanation: "It's typically a 'nice no.' Pin down the specific milestone, log it, and offer investor updates — some passers come back after seeing progress.", concept: "nice no" },
      { id: "p5", type: "mcq", prompt: "What is the difference between a lead and a following investor?", options: ["Leads invest less", "The lead sets terms and runs diligence; followers accept those terms once a lead commits", "Followers always invest first", "There is no difference"], correct: 1, explanation: "The lead negotiates terms and drives diligence. Once a credible lead commits, follower investors typically match the terms. The first investor is the hardest to land.", concept: "lead vs follow" },
      { id: "p6", type: "mcq", prompt: "Why raise enough to reach the NEXT milestone rather than the minimum?", options: ["To impress friends", "So you don't get stranded between stages, where raising is hardest", "To pay yourself more", "It lowers your valuation"], correct: 1, explanation: "Each round should fund you to the next fundable milestone (plus cushion). Getting stuck between stages makes the next raise very hard.", concept: "milestone funding" },
    ],
  },

  // ----------------------------------------------------------------- 6
  {
    id: "term-sheet",
    index: 6,
    title: "The Negotiation",
    subtitle: "The term sheet",
    objective: "Negotiate a term sheet, understand leverage, and know it isn't binding.",
    icon: "📜",
    accent: "gold",
    lessons: [
      {
        id: "what-is",
        title: "What a term sheet is",
        blocks: [
          { kind: "p", text: "A term sheet is a 1–2 page summary of the deal: valuation, how much is invested, how much equity, whether shares are preferred, board seats, and any special rights. It's negotiated with the LEAD investor." },
          { kind: "callout", tone: "warn", title: "It is NOT binding", text: "A term sheet is not a guaranteed contract — money isn't guaranteed. The deal still depends on passing diligence and signing the full legal documents. Treat the yes as conditional." },
          { kind: "callout", tone: "key", title: "Leverage = competition", text: "If several investors want to lead, they bid against each other and you have real bargaining power. If you have only one interested party, you have little leverage — and investors know time isn't on your side." },
        ],
      },
    ],
    questions: [
      { id: "ts1", type: "mcq", prompt: "A term sheet is best described as…", options: ["A 10–20 page binding contract", "A 1–2 page summary of the deal terms, negotiated with the lead", "The wire instructions", "The cap table"], correct: 1, explanation: "It's a short (1–2 page) summary of valuation, investment, equity, share class, and rights — negotiated with the lead investor.", concept: "term sheet" },
      { id: "ts2", type: "truefalse", prompt: "Once you sign a term sheet, the money is legally guaranteed.", options: ["True", "False"], correct: 1, explanation: "False. The term sheet is non-binding. The deal still hinges on due diligence and signing the full stock purchase agreement.", concept: "non-binding" },
      { id: "ts3", type: "mcq", prompt: "Where does your negotiating leverage mostly come from?", options: ["A great pitch deck", "Having multiple investors competing to lead", "A high burn rate", "A long term sheet"], correct: 1, explanation: "Competition is leverage. Multiple interested leads bid each other up. With one interested party (and a ticking clock), you have little power.", concept: "leverage" },
      { id: "ts4", type: "mcq", prompt: "Why is the lead investor so pivotal to closing a round?", options: ["They invest the least", "They set the terms and run diligence; once committed, followers match", "They own the company", "They write the legal docs for free"], correct: 1, explanation: "The lead defines terms and drives diligence; other investors follow at the same terms once a lead is in. Finding the first/lead is the hardest part.", concept: "lead investor" },
    ],
  },

  // ----------------------------------------------------------------- 7
  {
    id: "due-diligence",
    index: 7,
    title: "The Audit",
    subtitle: "Open the data room",
    objective: "Assemble a data room and survive ~a month of diligence.",
    icon: "🔍",
    accent: "sky",
    lessons: [
      {
        id: "data-room",
        title: "The data room",
        blocks: [
          { kind: "p", text: "After the term sheet, the lead runs DUE DILIGENCE: verifying that everything you pitched is true and that your house is in order. You assemble a 'data room' (often just a Google Drive folder) with every document they'll need. It typically takes about a month and is largely async." },
          { kind: "list", items: [
            "Financials: P&L, balance sheet, financial projections.",
            "Corporate/legal: incorporation docs, bylaws, cap table, prior round terms, board agreements.",
            "IP: registered trademarks, patents (if relevant), proof you own your code.",
            "Staff: org chart, key contracts, founder non-competes, IP assignment for all developed code.",
          ] },
          { kind: "callout", tone: "info", title: "Stay organized from day one", text: "If you've kept documents tidy as you go, diligence is mostly waiting. If not, you'll burn weeks emailing people (including ex-employees) to collect everything." },
        ],
      },
    ],
    questions: [
      { id: "dd1", type: "mcq", prompt: "Who typically runs due diligence on a round?", options: ["Every investor independently", "The lead investor", "The company's accountant", "The accelerator"], correct: 1, explanation: "The lead investor drives diligence (since they set the terms). Followers rely on the lead's work.", concept: "diligence owner" },
      { id: "dd2", type: "mcq", prompt: "A 'data room' is…", options: ["A physical server room", "A collected folder (often Google Drive) of all documents investors need to verify", "The investor's office", "A type of term sheet"], correct: 1, explanation: "It's the organized collection of financial, legal, IP, and staff documents investors review during diligence.", concept: "data room" },
      { id: "dd3", type: "truefalse", prompt: "Due diligence usually takes about a month and is largely an async process.", options: ["True", "False"], correct: 0, explanation: "True. The lead works through your documents on their own time over roughly a month, asking questions as they arise.", concept: "diligence timeline" },
      { id: "dd4", type: "mcq", prompt: "Which of these is NOT a typical diligence category?", options: ["Financials (P&L, balance sheet)", "IP (trademarks, code ownership)", "Staff (org chart, non-competes)", "The founder's personal social media follower count"], correct: 3, explanation: "Diligence covers financials, corporate/legal, IP, and staff. Personal follower counts aren't part of it.", concept: "diligence scope" },
    ],
  },

  // ----------------------------------------------------------------- 8
  {
    id: "legal-and-close",
    index: 8,
    title: "The Scribes",
    subtitle: "Sign & get the wire",
    objective: "Turn the term sheet into legal docs, manage fees, and close with capital calls.",
    icon: "🖋️",
    accent: "quest",
    lessons: [
      {
        id: "legal",
        title: "From term sheet to SPA",
        blocks: [
          { kind: "p", text: "If you pass diligence, lawyers convert the 1–2 page term sheet into a 5–20 page Stock Purchase Agreement (SPA) and related docs. The company creates the new shares it will sell to investors. This is the most EXPENSIVE part — and the company usually pays the legal fees." },
          { kind: "formula", label: "Typical legal fees", formula: "priced equity round ≈ $30k–$50k · convertible note ≈ ~$10k · SAFE ≈ cheapest (template)", note: "Negotiate a cap with your lawyers so fees can't run away." },
          { kind: "callout", tone: "warn", title: "Don't cut corners here", text: "These documents define how your company is split forever. A mistake now is painful and expensive later. Reviewing fine print and collecting signatures takes about a month (less for a SAFE/note)." },
        ],
      },
      {
        id: "capital-calls",
        title: "Capital calls & the timeline",
        blocks: [
          { kind: "p", text: "Signed isn't funded. A CAPITAL CALL is when you send investors the wire instructions and they transfer the money. Budget a couple of weeks from signing to cash actually landing in the company's bank account." },
          { kind: "callout", tone: "key", title: "The whole journey: 4–6 months", text: "Pitch → term sheet → diligence (~1mo) → legal (~1mo) → capital call (~2wks). For the founder/CEO it's largely a full-time job. Plan for the business to keep running without you, and start fundraising before you're desperate." },
        ],
      },
    ],
    questions: [
      { id: "lc1", type: "mcq", prompt: "Roughly what do legal fees for a priced equity round run?", options: ["~$1k", "~$10k", "$30k–$50k", "Free with a template"], correct: 2, explanation: "A priced round typically costs $30k–$50k in legal fees (paid by the company). Notes run ~$10k; SAFEs are cheapest since they use templates.", concept: "legal fees" },
      { id: "lc2", type: "mcq", prompt: "A 'capital call' is…", options: ["A pitch meeting", "Sending wire instructions so signed investors transfer their money", "A board vote", "A type of term sheet"], correct: 1, explanation: "Signing doesn't move money. The capital call delivers wire instructions and investors fund — usually landing within a couple of weeks.", concept: "capital call" },
      { id: "lc3", type: "mcq", prompt: "About how long does the full fundraise (pitch to cash in bank) typically take?", options: ["1–2 weeks", "1 month", "4–6 months", "Over a year"], correct: 2, explanation: "Pitch + diligence (~1mo) + legal (~1mo) + capital call (~2wks) ≈ 4–6 months, and it's largely a full-time job for the CEO.", concept: "fundraise timeline" },
      { id: "lc4", type: "truefalse", prompt: "Once the legal documents are signed, the money is already in the company's account.", options: ["True", "False"], correct: 1, explanation: "False. After signing comes the capital call — wire instructions go out and funds arrive over the following days/weeks.", concept: "signed vs funded" },
      { id: "lc5", type: "mcq", prompt: "Why should you start fundraising before you actually need the money?", options: ["It's cheaper", "Time pressure destroys your negotiating leverage — desperation is visible", "Investors require it", "It avoids legal fees"], correct: 1, explanation: "If you're in a hurry, you lose leverage. Investors know time isn't on your side. Raise with runway to spare.", concept: "timing leverage" },
      { id: "lc6", type: "calc", prompt: "You have $600k in the bank and burn $50k/month net. What's your runway?", options: ["6 months", "12 months", "18 months", "3 months"], correct: 1, explanation: "Runway = cash ÷ net monthly burn = $600k ÷ $50k = 12 months. You generally raise with 6–12 months of runway left.", concept: "runway & burn" },
    ],
  },

  // ----------------------------------------------------------------- 9
  {
    id: "accelerators",
    index: 9,
    title: "The Academy",
    subtitle: "YC & the accelerators",
    objective: "Decide if an accelerator's equity cost buys enough money, network, and knowledge.",
    icon: "🎓",
    accent: "gold",
    lessons: [
      {
        id: "what-they-are",
        title: "Incubators vs accelerators",
        blocks: [
          { kind: "p", text: "An accelerator makes many small bets in a cohort and helps them succeed — like a VC fund at smaller scale. Y Combinator practically invented the model: ~$500k per company. 500 Startups' flagship wrote ~$150k for 6%. Programs are ranked mostly by REPUTATION — how many successful startups they've produced — which is what makes raising afterward easier." },
          { kind: "callout", tone: "info", title: "Three real reasons to do one", text: "Money (a small bridge, rarely enough on its own — think of it as runway to the next milestone), a crash course in startup fluency, and — most valuably — a network: future investors, hires, advisors, and even a soft landing if the company fails." },
        ],
      },
      {
        id: "demo-day",
        title: "Demo day & getting in",
        blocks: [
          { kind: "callout", tone: "warn", title: "Demo day is the START, not the finish", text: "A common, painful mistake: treating demo day as where you raise money. In reality deals are mostly cooked beforehand; demo day is closer to a PR stunt. Budget time and money to follow up for weeks afterward." },
          { kind: "list", items: [
            "Traction beats everything — revenue or active users, not vanity signups/beta users.",
            "Show you understand your KPIs, customers, and market better than competitors.",
            "Send a self-explanatory email deck with the application.",
            "Don't apply too early or only for the money — partners want a fit where their expertise matches your needs.",
          ] },
        ],
      },
    ],
    questions: [
      { id: "ac1", type: "mcq", prompt: "As of recent years, roughly how much does Y Combinator invest per company?", options: ["~$25k", "~$150k", "~$500k", "~$2M"], correct: 2, explanation: "YC writes ~$500k. 500 Startups' flagship was ~$150k for 6%. No other accelerator writes checks as large as YC's.", concept: "yc check" },
      { id: "ac2", type: "mcq", prompt: "What ranks accelerators against each other most?", options: ["Check size", "Reputation — track record of successful startups", "Office location", "Length of program"], correct: 1, explanation: "Reputation (successful alumni) is the real ranking and what makes raising afterward easier — the name on your badge carries weight.", concept: "accelerator tiers" },
      { id: "ac3", type: "truefalse", prompt: "Demo day is where most accelerator companies actually close their funding.", options: ["True", "False"], correct: 1, explanation: "False. Deals are mostly arranged beforehand; demo day is largely PR. The real work is weeks of follow-up afterward — budget for it.", concept: "demo day" },
      { id: "ac4", type: "mcq", prompt: "Which metric most impresses an accelerator?", options: ["Signups", "Beta users", "Revenue or active users (real traction)", "Social media followers"], correct: 2, explanation: "Traction beats everything; revenue (ideally) or active users. Signups and beta users are vanity metrics.", concept: "traction" },
      { id: "ac5", type: "mcq", prompt: "The MOST valuable thing a good accelerator usually provides is…", options: ["The cash", "The network — investors, hires, advisors, soft landings", "Free office snacks", "A guaranteed next round"], correct: 1, explanation: "The money is a small bridge; the durable value is the network and the crash course. The name badge helps but never guarantees a future raise.", concept: "accelerator value" },
    ],
  },

  // ----------------------------------------------------------------- 10  (BRANCHING)
  {
    id: "growth-engine",
    index: 10,
    title: "The Crossroads",
    subtitle: "Choose your growth path",
    objective: "Pick a go-to-market motion and learn the metrics that make it win.",
    icon: "🧭",
    accent: "quest",
    lessons: [
      {
        id: "aarrr",
        title: "The growth fundamentals (all paths)",
        blocks: [
          { kind: "p", text: "Before choosing a path, every founder shares one language. The AARRR 'pirate metrics' funnel: Acquisition → Activation → Retention → Referral → Revenue. ACTIVATION is the first 'aha' moment a new user reaches real value." },
          { kind: "formula", label: "Unit economics", formula: "LTV : CAC should be ≥ 3:1, with CAC payback under ~12 months", note: "CAC = cost to acquire a customer. LTV = lifetime value. If you spend more to get a customer than they're worth, you don't have a business — you have a leak." },
          { kind: "p", text: "Now choose how you'll actually grow. Each motion lives or dies by different metrics." },
        ],
      },
    ],
    questions: [
      { id: "ge1", type: "mcq", prompt: "What does the 'A-A-R-R-R' pirate-metrics funnel stand for?", options: ["Ads, App, Revenue, Reviews, Retention", "Acquisition, Activation, Retention, Referral, Revenue", "Awareness, Acquisition, Revenue, Referral, Renewal", "Acquisition, Ads, Retention, Reach, Revenue"], correct: 1, explanation: "AARRR = Acquisition, Activation, Retention, Referral, Revenue — the core growth funnel coined by Dave McClure.", concept: "aarrr" },
      { id: "ge2", type: "mcq", prompt: "A healthy LTV:CAC ratio is generally considered to be at least…", options: ["1:1", "3:1", "10:1", "1:3"], correct: 1, explanation: "≥3:1 is the rule of thumb: a customer should be worth at least 3× what you spend to acquire them, with payback under ~12 months.", concept: "ltv:cac" },
      { id: "ge3", type: "mcq", prompt: "'Activation' in the growth funnel means…", options: ["A user paying", "A new user reaching their first real 'aha' value moment", "Turning on a feature flag", "Signing up"], correct: 1, explanation: "Activation is the moment a new user first experiences the product's core value — distinct from merely acquiring (signing up) them.", concept: "activation" },
    ],
    branching: [
      {
        id: "plg",
        name: "Product-Led Growth",
        emoji: "🚀",
        blurb: "The product sells itself. Free/freemium, self-serve, viral loops. (Slack, Figma, Dropbox)",
        lessons: [
          {
            id: "plg-lesson",
            title: "Product-Led Growth",
            blocks: [
              { kind: "p", text: "In PLG the PRODUCT is the main acquisition, conversion, and expansion engine. Users sign up themselves (freemium or free trial), reach value fast, and often invite others. Sales is light-touch or absent." },
              { kind: "p", text: "Fits products with fast time-to-value, low friction, and natural collaboration/virality. Key metrics: activation rate, time-to-value, free→paid conversion, product-qualified leads (PQLs), and the viral coefficient (K-factor — how many new users each user brings)." },
              { kind: "callout", tone: "info", title: "Example", text: "Slack, Figma, Dropbox, Calendly — you experience the value before you ever talk to a human." },
            ],
          },
        ],
        questions: [
          { id: "plg1", type: "mcq", prompt: "In Product-Led Growth, the primary driver of acquisition and expansion is…", options: ["An outbound sales team", "The product itself (self-serve, viral)", "TV advertising", "Channel partners"], correct: 1, explanation: "PLG uses the product as the growth engine — self-serve signup, fast value, and built-in virality, with minimal sales.", concept: "plg" },
          { id: "plg2", type: "mcq", prompt: "Which metric is most central to a PLG motion?", options: ["Sales quota attainment", "Activation rate & free→paid conversion", "Billboard impressions", "Partner count"], correct: 1, explanation: "PLG lives on activation, time-to-value, free→paid conversion, PQLs, and viral coefficient — product usage signals, not sales quotas.", concept: "plg metrics" },
          { id: "plg3", type: "mcq", prompt: "A 'PQL' (product-qualified lead) is a lead qualified by…", options: ["A salesperson's gut", "Their actual product usage/behavior hitting value", "Marketing email opens", "A partner referral"], correct: 1, explanation: "A PQL is qualified by in-product behavior signaling readiness to buy — the PLG analog of an MQL/SQL.", concept: "pql" },
          { id: "plg4", type: "mcq", prompt: "The viral coefficient (K-factor) measures…", options: ["Server uptime", "How many new users each existing user brings in", "Churn rate", "Gross margin"], correct: 1, explanation: "K-factor = invites sent × conversion rate. K>1 means self-sustaining viral growth — a PLG dream metric.", concept: "k-factor" },
        ],
      },
      {
        id: "slg",
        name: "Sales-Led Growth",
        emoji: "🤝",
        blurb: "Humans close deals. Demos, pipeline, quotas. Great for high-ACV/enterprise. (Salesforce, Oracle)",
        lessons: [
          {
            id: "slg-lesson",
            title: "Sales-Led Growth",
            blocks: [
              { kind: "p", text: "In SLG a sales TEAM drives revenue: outbound prospecting, demos, negotiation, and closing. It fits expensive, complex, or enterprise products where buyers need hand-holding and contracts are large (high ACV — annual contract value)." },
              { kind: "p", text: "Key metrics: pipeline coverage, win rate, sales cycle length, quota attainment, and the MQL→SQL→deal funnel. CAC is higher than PLG but justified by big contract values." },
              { kind: "callout", tone: "info", title: "Example", text: "Salesforce, Oracle, most enterprise software with six-figure contracts and procurement processes." },
            ],
          },
        ],
        questions: [
          { id: "slg1", type: "mcq", prompt: "Sales-Led Growth is the best fit for…", options: ["Cheap, self-serve consumer apps", "Expensive, complex, enterprise products with large contracts (high ACV)", "Viral social products", "Open-source tools"], correct: 1, explanation: "SLG suits high-ACV, complex/enterprise sales where buyers need demos, negotiation, and procurement — humans close the deal.", concept: "slg" },
          { id: "slg2", type: "mcq", prompt: "An 'SQL' in a sales funnel is a…", options: ["Database query", "Sales-Qualified Lead — vetted as a real opportunity by sales", "Standard Quarterly License", "Self-Qualified Login"], correct: 1, explanation: "MQL (marketing-qualified) → SQL (sales-qualified, a real opportunity) → deal. SQL means sales has vetted it as worth pursuing.", concept: "sql" },
          { id: "slg3", type: "mcq", prompt: "Compared to PLG, SLG typically has…", options: ["Lower CAC and shorter cycles", "Higher CAC and longer sales cycles, offset by larger contracts", "No CAC at all", "No need for metrics"], correct: 1, explanation: "Sales teams are expensive (higher CAC) and enterprise cycles are long, but large contract values justify the cost.", concept: "slg economics" },
          { id: "slg4", type: "mcq", prompt: "'Pipeline coverage' refers to…", options: ["Insurance for the sales team", "The ratio of open pipeline value to the sales target", "Server bandwidth", "Number of demos given"], correct: 1, explanation: "Pipeline coverage compares total open opportunity value against quota/target — a core SLG health metric (often 3–4× target).", concept: "pipeline" },
        ],
      },
      {
        id: "mlg",
        name: "Marketing-Led Growth",
        emoji: "📣",
        blurb: "Content, SEO, ads, brand pull demand. Inbound funnels at scale. (HubSpot, Mailchimp)",
        lessons: [
          {
            id: "mlg-lesson",
            title: "Marketing-Led Growth",
            blocks: [
              { kind: "p", text: "In MLG, MARKETING generates demand at scale — content/SEO, paid ads, brand, email — feeding an inbound funnel that converts (sometimes self-serve, sometimes handed to sales). It fits products with broad audiences and clear search intent." },
              { kind: "p", text: "Key metrics: marketing-qualified leads (MQLs), cost per lead, channel CAC, conversion rate by channel, and content/SEO traffic. The risk is paid-channel dependence: if CAC rises faster than LTV, growth stalls." },
              { kind: "callout", tone: "info", title: "Example", text: "HubSpot (inbound/content engine), Mailchimp, many DTC and SMB-SaaS brands." },
            ],
          },
        ],
        questions: [
          { id: "mlg1", type: "mcq", prompt: "Marketing-Led Growth primarily drives growth through…", options: ["Outbound cold calling", "Content/SEO, paid ads, and brand generating inbound demand at scale", "Product virality only", "Channel partners only"], correct: 1, explanation: "MLG builds demand via content, SEO, ads, and brand, feeding an inbound funnel. It fits broad audiences with clear search intent.", concept: "mlg" },
          { id: "mlg2", type: "mcq", prompt: "An 'MQL' is a lead qualified by…", options: ["Product usage", "Marketing engagement signals (downloads, opens, content)", "A signed contract", "A partner"], correct: 1, explanation: "A Marketing-Qualified Lead shows enough marketing engagement to be worth passing toward sales or self-serve conversion.", concept: "mql" },
          { id: "mlg3", type: "mcq", prompt: "The classic risk of a paid-ads-heavy MLG motion is…", options: ["Too much organic traffic", "CAC rising faster than LTV, stalling growth", "Too many product-qualified leads", "Negative churn"], correct: 1, explanation: "Heavy reliance on paid channels means growth dies if acquisition cost climbs above what a customer is worth.", concept: "paid risk" },
          { id: "mlg4", type: "mcq", prompt: "Which is a core MLG metric?", options: ["Quota attainment", "Cost per lead and channel CAC", "Viral K-factor", "Liquidation preference"], correct: 1, explanation: "MLG tracks cost per lead, channel CAC, conversion by channel, and content/SEO traffic.", concept: "mlg metrics" },
        ],
      },
    ],
  },

  // ----------------------------------------------------------------- 11
  {
    id: "retention-expansion",
    index: 11,
    title: "The Kingdom",
    subtitle: "Keep & grow customers",
    objective: "Master churn, retention curves, and why net revenue retention can exceed 100%.",
    icon: "👑",
    accent: "heart",
    lessons: [
      {
        id: "churn-retention",
        title: "Churn & retention",
        blocks: [
          { kind: "p", text: "Acquiring customers is pointless if they leave. CHURN is the rate at which customers (logo churn) or revenue (revenue churn) leave. RETENTION is its inverse. The most-used startup KPI is churn — not the 'net revenue retention' you learn in business school." },
          { kind: "p", text: "Plot a COHORT RETENTION CURVE: of users who joined in a month, what % are still active later? A healthy product's curve flattens (a 'smile' if it ticks back up) instead of decaying to zero — proof of durable value." },
          { kind: "compare", left: { title: "MRR / ARR", items: ["Monthly / Annual Recurring Revenue", "The recurring revenue base", "ARR ≈ MRR × 12"] }, right: { title: "GRR vs NRR", items: ["GRR: revenue kept, ignoring upsell (≤100%)", "NRR: kept + expansion − contraction/churn", "NRR can exceed 100%"] } },
        ],
      },
      {
        id: "expansion",
        title: "Expansion & NRR",
        blocks: [
          { kind: "callout", tone: "key", title: "Why NRR > 100% is magic", text: "Net Revenue Retention (a.k.a. NDR) measures revenue from existing customers over time, including upsell/cross-sell minus churn and contraction. If NRR > 100%, your existing customers grow your revenue even if you acquire NOBODY new. Best-in-class SaaS hits ~120%+; >110% is strong." },
          { kind: "list", items: [
            "Upsell: sell the same customer a bigger/higher tier. Cross-sell: sell them an additional product.",
            "Land-and-expand: win a small foothold, then grow the account over time.",
            "GRR (gross revenue retention) caps at 100% — it only counts what you keep, not expansion.",
            "Good SaaS benchmarks: annual logo churn under ~5–7% for SMB, much lower for enterprise; NRR >110% is strong.",
          ] },
        ],
      },
    ],
    questions: [
      { id: "re1", type: "mcq", prompt: "Net Revenue Retention (NRR) above 100% means…", options: ["You're losing money", "Existing customers grow your revenue even with zero new customers", "Everyone churned", "Your CAC is too high"], correct: 1, explanation: "NRR includes expansion (upsell/cross-sell) minus churn/contraction. >100% means your existing base grows revenue on its own — a powerful flywheel.", concept: "nrr" },
      { id: "re2", type: "mcq", prompt: "What's the difference between GRR and NRR?", options: ["They're identical", "GRR ignores expansion (caps at 100%); NRR adds expansion and can exceed 100%", "GRR includes new customers", "NRR is always lower"], correct: 1, explanation: "Gross Revenue Retention only counts revenue kept (≤100%). Net Revenue Retention adds expansion revenue, so it can go above 100%.", concept: "grr vs nrr" },
      { id: "re3", type: "mcq", prompt: "'Logo churn' refers to losing…", options: ["Revenue", "Customers (accounts), regardless of their size", "Brand assets", "Employees"], correct: 1, explanation: "Logo churn counts lost customers/accounts; revenue churn counts lost dollars. A few big accounts leaving can mean low logo churn but high revenue churn.", concept: "logo vs revenue churn" },
      { id: "re4", type: "mcq", prompt: "A healthy cohort retention curve should…", options: ["Decay to zero quickly", "Flatten out (or smile upward), showing durable value", "Always be a straight line down", "Be irrelevant to startups"], correct: 1, explanation: "A flattening (or upward-curving 'smile') retention curve shows that a core of users sticks — evidence of real product value.", concept: "retention curve" },
      { id: "re5", type: "mcq", prompt: "'Land and expand' describes…", options: ["Buying competitors", "Winning a small initial deal, then growing the account over time", "Geographic expansion only", "Raising a bigger round"], correct: 1, explanation: "Land-and-expand: get a foothold with a small purchase, then upsell/cross-sell to grow that customer's spend — a key driver of high NRR.", concept: "land and expand" },
      { id: "re6", type: "truefalse", prompt: "Upsell means selling an existing customer an additional, different product.", options: ["True", "False"], correct: 1, explanation: "False — that's cross-sell. Upsell means moving them to a bigger/higher tier of the same product. Both drive expansion revenue.", concept: "upsell vs cross-sell" },
    ],
  },

  // ----------------------------------------------------------------- 12
  {
    id: "the-exit",
    index: 12,
    title: "The Summit",
    subtitle: "The exit",
    objective: "Tell the exit types apart and survive the M&A gauntlet to the close.",
    icon: "🏔️",
    accent: "gold",
    lessons: [
      {
        id: "exit-types",
        title: "Types of exit",
        blocks: [
          { kind: "p", text: "The whole VC model assumes a future exit — IPO or acquisition. But not all acquisitions are equal. Here's the spectrum, from worst to best for founders:" },
          { kind: "list", items: [
            "Acquihire: the buyer mainly wants the TEAM. Product is shut down, price is never disclosed, founders make little. A graceful return to corporate life.",
            "Financial buyer: buys you for your future CASH FLOWS. Values you on a profit multiple (often 3–10× EBITDA). No strategic angle — it's about profits.",
            "Strategic buyer: sees extra value in your tech, customers, or niche. Prices above a financial buyer because of synergy.",
            "Rockstar deal: both companies worth hundreds of millions+; the merger just makes sense (Instagram, WhatsApp).",
          ] },
          { kind: "callout", tone: "info", title: "Reading the clues", text: "Acquihires never reveal the price and shut the product quickly. Financial buyers talk EBITDA multiples. The bigger and more strategic, the higher the multiple." },
        ],
      },
      {
        id: "ma-process",
        title: "The M&A gauntlet",
        blocks: [
          { kind: "callout", tone: "warn", title: "LOI ≠ done", text: "A Letter of Intent (LOI) / term sheet starts the process — it usually carries an NDA and EXCLUSIVITY (you can't shop other deals). But 'intent' is not a fact: either side can still walk, and the price can be cut late when you have no leverage left." },
          { kind: "p", text: "Then comes brutal due diligence — thousands of questions, six-figure+ legal fees, often a year long. Signing the merger docs and CLOSING (funding the transaction) can be separate events; some deals 'sign' with conditions that must be met before they 'close'." },
          { kind: "callout", tone: "key", title: "Your endgame isn't control — it's the sale", text: "Selling means giving away all your shares, ideally for a great price. Control along the way comes from the board, not from owning the most equity. Plan the deal so your team comes out well, too." },
        ],
      },
    ],
    questions: [
      { id: "ex1", type: "mcq", prompt: "In an 'acquihire', the buyer is mainly acquiring…", options: ["The revenue", "The team (talent)", "The patents", "The brand"], correct: 1, explanation: "An acquihire buys a proven, trained team. The product is usually shut down, the price is undisclosed, and founders rarely make much — it's a graceful exit from a struggling startup.", concept: "acquihire" },
      { id: "ex2", type: "mcq", prompt: "A financial buyer typically values a company using…", options: ["A revenue-multiple of 28×", "A profit multiple, often 3–10× EBITDA", "The founder's salary", "The 409A valuation"], correct: 1, explanation: "Financial buyers want future cash flows and apply an EBITDA multiple (commonly 3–10×). They have no strategic/synergy angle — it's about profit.", concept: "financial buyer" },
      { id: "ex3", type: "mcq", prompt: "What distinguishes a STRATEGIC buyer from a financial one?", options: ["They pay less", "They see extra value in your tech, customers, or niche (synergy) and pay more", "They only buy profitable companies", "They never sign LOIs"], correct: 1, explanation: "A strategic buyer values synergy — your technology, customer base, or market entry — and therefore pays above a pure financial buyer.", concept: "strategic buyer" },
      { id: "ex4", type: "truefalse", prompt: "Once you sign a Letter of Intent (LOI), the acquisition is guaranteed to close.", options: ["True", "False"], correct: 1, explanation: "False. An LOI signals intent (usually with NDA + exclusivity) but isn't binding — either side can walk, and the price can still be cut before closing.", concept: "loi" },
      { id: "ex5", type: "mcq", prompt: "In M&A, 'signing' and 'closing' are…", options: ["Always the same moment", "Sometimes separate — closing (funding the deal) can require conditions met after signing", "Both before due diligence", "Done by the buyer alone"], correct: 1, explanation: "Signing the merger docs and closing (actually funding the transaction) can be distinct; conditional deals require milestones between sign and close.", concept: "sign vs close" },
      { id: "ex6", type: "mcq", prompt: "Throughout the company's life, control ultimately comes from…", options: ["Owning the most equity", "The board of directors and voting rights", "Being the CEO", "The largest investor"], correct: 1, explanation: "Control rests with the board and voting rights, not raw ownership percentage. The founder's endgame is selling shares well — not clinging to a majority.", concept: "control vs ownership" },
    ],
  },
];

export const worldById = (id: string) => WORLDS.find((w) => w.id === id);

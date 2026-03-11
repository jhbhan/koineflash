import { Flashcard } from '../types';

export const flashcards: Flashcard[] = [
  // 1st Declension — η-stem
  { id: "1d-eta-nom-sg", category: "noun-1st-decl", prompt: "1st Decl. η-stem — Nominative Singular", answer: "-η", hint: "Subject form", exampleWord: "ἀρχή", translation: "beginning" },
  { id: "1d-eta-gen-sg", category: "noun-1st-decl", prompt: "1st Decl. η-stem — Genitive Singular", answer: "-ης", hint: "Possession / 'of'", exampleWord: "ἀρχῆς", translation: "of a beginning" },
  { id: "1d-eta-dat-sg", category: "noun-1st-decl", prompt: "1st Decl. η-stem — Dative Singular", answer: "-ῃ", hint: "To/for — note iota subscript", exampleWord: "ἀρχῇ", translation: "to/for a beginning" },
  { id: "1d-eta-acc-sg", category: "noun-1st-decl", prompt: "1st Decl. η-stem — Accusative Singular", answer: "-ην", hint: "Direct object", exampleWord: "ἀρχήν", translation: "beginning (direct obj)" },
  { id: "1d-eta-voc-sg", category: "noun-1st-decl", prompt: "1st Decl. η-stem — Vocative Singular", answer: "-η", hint: "Direct address — same as nominative", exampleWord: "ἀρχή", translation: "O beginning!" },
  { id: "1d-nom-pl",     category: "noun-1st-decl", prompt: "1st Decl. — Nominative Plural", answer: "-αι", hint: "All 1st decl use -αι here", exampleWord: "ἀρχαί", translation: "beginnings" },
  { id: "1d-gen-pl",     category: "noun-1st-decl", prompt: "1st Decl. — Genitive Plural", answer: "-ων", hint: "Shared with 2nd decl gen. pl.", exampleWord: "ἀρχῶν", translation: "of beginnings" },
  { id: "1d-dat-pl",     category: "noun-1st-decl", prompt: "1st Decl. — Dative Plural", answer: "-αις", hint: "Ends in -αις", exampleWord: "ἀρχαῖς", translation: "to/for beginnings" },
  { id: "1d-acc-pl",     category: "noun-1st-decl", prompt: "1st Decl. — Accusative Plural", answer: "-ας", hint: "Short alpha", exampleWord: "ἀρχάς", translation: "beginnings (pl obj)" },
  { id: "1d-alpha-nom-sg", category: "noun-1st-decl", prompt: "1st Decl. α-stem — Nominative Singular", answer: "-α", hint: "Pure alpha stem (after ρ, ε, ι)", exampleWord: "ἡμέρα", translation: "day" },
  { id: "1d-alpha-gen-sg", category: "noun-1st-decl", prompt: "1st Decl. α-stem — Genitive Singular", answer: "-ας", hint: "Alpha remains throughout", exampleWord: "ἡμέρας", translation: "of a day" },
  { id: "1d-alpha-dat-sg", category: "noun-1st-decl", prompt: "1st Decl. α-stem — Dative Singular", answer: "-ᾳ", hint: "Alpha with iota subscript", exampleWord: "ἡμέρᾳ", translation: "to/for a day" },
  { id: "1d-alpha-acc-sg", category: "noun-1st-decl", prompt: "1st Decl. α-stem — Accusative Singular", answer: "-αν", hint: "Alpha + nu", exampleWord: "ἡμέραν", translation: "day (direct obj)" },

  // 2nd Declension — Masculine
  { id: "2d-m-nom-sg", category: "noun-2nd-decl", prompt: "2nd Decl. Masculine — Nominative Singular", answer: "-ος", hint: "Subject form", exampleWord: "λόγος", translation: "word" },
  { id: "2d-m-gen-sg", category: "noun-2nd-decl", prompt: "2nd Decl. Masculine — Genitive Singular", answer: "-ου", hint: "Of / possession", exampleWord: "λόγου", translation: "of a word" },
  { id: "2d-m-dat-sg", category: "noun-2nd-decl", prompt: "2nd Decl. Masculine — Dative Singular", answer: "-ῳ", hint: "Omega with iota subscript", exampleWord: "λόγῳ", translation: "to/for a word" },
  { id: "2d-m-acc-sg", category: "noun-2nd-decl", prompt: "2nd Decl. Masculine — Accusative Singular", answer: "-ον", hint: "Direct object", exampleWord: "λόγον", translation: "word (direct obj)" },
  { id: "2d-m-voc-sg", category: "noun-2nd-decl", prompt: "2nd Decl. Masculine — Vocative Singular", answer: "-ε", hint: "Epsilon — unique to vocative sg.", exampleWord: "λόγε", translation: "O word!" },
  { id: "2d-m-nom-pl", category: "noun-2nd-decl", prompt: "2nd Decl. Masculine — Nominative Plural", answer: "-οι", hint: "Like Greek 'they'", exampleWord: "λόγοι", translation: "words" },
  { id: "2d-m-gen-pl", category: "noun-2nd-decl", prompt: "2nd Decl. Masculine — Genitive Plural", answer: "-ων", hint: "Shared across declensions", exampleWord: "λόγων", translation: "of words" },
  { id: "2d-m-dat-pl", category: "noun-2nd-decl", prompt: "2nd Decl. Masculine — Dative Plural", answer: "-οις", hint: "Omicron + iota + sigma", exampleWord: "λόγοις", translation: "to/for words" },
  { id: "2d-m-acc-pl", category: "noun-2nd-decl", prompt: "2nd Decl. Masculine — Accusative Plural", answer: "-ους", hint: "Long ou sound", exampleWord: "λόγους", translation: "words (pl obj)" },

  // 2nd Declension — Neuter
  { id: "2d-n-nom-sg",  category: "noun-2nd-decl", prompt: "2nd Decl. Neuter — Nominative Singular", answer: "-ον", hint: "Same as masc. accusative sg.", exampleWord: "ἔργον", translation: "work/deed" },
  { id: "2d-n-acc-sg",  category: "noun-2nd-decl", prompt: "2nd Decl. Neuter — Accusative Singular", answer: "-ον", hint: "Nom = Acc for neuter always", exampleWord: "ἔργον", translation: "work/deed (obj)" },
  { id: "2d-n-nom-pl",  category: "noun-2nd-decl", prompt: "2nd Decl. Neuter — Nominative/Accusative Plural", answer: "-α", hint: "Neuter pl. nom/acc always ends in -α", exampleWord: "ἔργα", translation: "works/deeds" },
  { id: "2d-n-gen-sg",  category: "noun-2nd-decl", prompt: "2nd Decl. Neuter — Genitive Singular", answer: "-ου", hint: "Same as masculine genitive sg.", exampleWord: "ἔργου", translation: "of a work" },
  { id: "2d-n-dat-sg",  category: "noun-2nd-decl", prompt: "2nd Decl. Neuter — Dative Singular", answer: "-ῳ", hint: "Same as masculine dative sg.", exampleWord: "ἔργῳ", translation: "to/for a work" },

  // 3rd Declension
  { id: "3d-gen-sg",      category: "noun-3rd-decl", prompt: "3rd Decl. — Genitive Singular", answer: "-ος", hint: "Key identifier for 3rd decl.", exampleWord: "σαρκός", translation: "of flesh" },
  { id: "3d-dat-sg",      category: "noun-3rd-decl", prompt: "3rd Decl. — Dative Singular", answer: "-ι", hint: "Simple iota", exampleWord: "σαρκί", translation: "to/for flesh" },
  { id: "3d-acc-sg",      category: "noun-3rd-decl", prompt: "3rd Decl. — Accusative Singular", answer: "-α", hint: "Short alpha", exampleWord: "σάρκα", translation: "flesh (obj)" },
  { id: "3d-nom-pl",      category: "noun-3rd-decl", prompt: "3rd Decl. Masc/Fem — Nominative Plural", answer: "-ες", hint: "Epsilon + sigma", exampleWord: "σάρκες", translation: "flesh (pl)" },
  { id: "3d-gen-pl",      category: "noun-3rd-decl", prompt: "3rd Decl. — Genitive Plural", answer: "-ων", hint: "Shared ending across all declensions", exampleWord: "σαρκῶν", translation: "of flesh (pl)" },
  { id: "3d-dat-pl",      category: "noun-3rd-decl", prompt: "3rd Decl. — Dative Plural", answer: "-σι(ν)", hint: "Sigma + iota + moveable nu", exampleWord: "σαρξίν", translation: "to/for flesh (pl)" },
  { id: "3d-acc-pl",      category: "noun-3rd-decl", prompt: "3rd Decl. Masc/Fem — Accusative Plural", answer: "-ας", hint: "Alpha + sigma", exampleWord: "σάρκας", translation: "flesh (pl obj)" },
  { id: "3d-neut-nom-pl", category: "noun-3rd-decl", prompt: "3rd Decl. Neuter — Nominative/Accusative Plural", answer: "-α", hint: "Like all neuter plurals", exampleWord: "πνεύματα", translation: "spirits" },
  { id: "3d-neut-gen-sg", category: "noun-3rd-decl", prompt: "3rd Decl. Neuter (πνεῦμα) — Genitive Singular", answer: "-ατος", hint: "Stem expands: πνευματ-", exampleWord: "πνεύματος", translation: "of a spirit" },

  // Present Active Indicative
  { id: "vpa-1sg", category: "verb-present-active", prompt: "Present Active — 1st Singular (I ___)", answer: "-ω", hint: "Omega — the dictionary form", exampleWord: "λύω", translation: "I loose" },
  { id: "vpa-2sg", category: "verb-present-active", prompt: "Present Active — 2nd Singular (You ___)", answer: "-εις", hint: "Epsilon + iota + sigma", exampleWord: "λύεις", translation: "You loose" },
  { id: "vpa-3sg", category: "verb-present-active", prompt: "Present Active — 3rd Singular (He/She/It ___)", answer: "-ει", hint: "Epsilon + iota (no sigma)", exampleWord: "λύει", translation: "He/she looses" },
  { id: "vpa-1pl", category: "verb-present-active", prompt: "Present Active — 1st Plural (We ___)", answer: "-ομεν", hint: "Omicron + men", exampleWord: "λύομεν", translation: "We loose" },
  { id: "vpa-2pl", category: "verb-present-active", prompt: "Present Active — 2nd Plural (You all ___)", answer: "-ετε", hint: "Epsilon + te", exampleWord: "λύετε", translation: "You all loose" },
  { id: "vpa-3pl", category: "verb-present-active", prompt: "Present Active — 3rd Plural (They ___)", answer: "-ουσι(ν)", hint: "Ou + si + moveable nu", exampleWord: "λύουσιν", translation: "They loose" },

  // Present Middle/Passive
  { id: "vmp-1sg", category: "verb-mid-pass", prompt: "Present Mid/Pass — 1st Singular", answer: "-ομαι", hint: "Omicron + mai", exampleWord: "λύομαι", translation: "I am loosed" },
  { id: "vmp-2sg", category: "verb-mid-pass", prompt: "Present Mid/Pass — 2nd Singular", answer: "-ῃ", hint: "Eta with iota subscript (contracted)", exampleWord: "λύῃ", translation: "You are loosed" },
  { id: "vmp-3sg", category: "verb-mid-pass", prompt: "Present Mid/Pass — 3rd Singular", answer: "-εται", hint: "Epsilon + tai", exampleWord: "λύεται", translation: "He/she is loosed" },
  { id: "vmp-1pl", category: "verb-mid-pass", prompt: "Present Mid/Pass — 1st Plural", answer: "-ομεθα", hint: "Omicron + metha", exampleWord: "λυόμεθα", translation: "We are loosed" },
  { id: "vmp-2pl", category: "verb-mid-pass", prompt: "Present Mid/Pass — 2nd Plural", answer: "-εσθε", hint: "Epsilon + sthe", exampleWord: "λύεσθε", translation: "You all are loosed" },
  { id: "vmp-3pl", category: "verb-mid-pass", prompt: "Present Mid/Pass — 3rd Plural", answer: "-ονται", hint: "Omicron + ntai", exampleWord: "λύονται", translation: "They are loosed" },

  // Imperfect Active
  { id: "via-1sg", category: "verb-imperfect", prompt: "Imperfect Active — 1st Singular", answer: "ἔ- + stem + -ον", hint: "Augment + secondary ending", exampleWord: "ἔλυον", translation: "I was loosing" },
  { id: "via-2sg", category: "verb-imperfect", prompt: "Imperfect Active — 2nd Singular", answer: "ἔ- + stem + -ες", hint: "Augment + es", exampleWord: "ἔλυες", translation: "You were loosing" },
  { id: "via-3sg", category: "verb-imperfect", prompt: "Imperfect Active — 3rd Singular", answer: "ἔ- + stem + -ε(ν)", hint: "Augment + en", exampleWord: "ἔλυε(ν)", translation: "He/she was loosing" },
  { id: "via-1pl", category: "verb-imperfect", prompt: "Imperfect Active — 1st Plural", answer: "ἔ- + stem + -ομεν", hint: "Like present but with augment", exampleWord: "ἐλύομεν", translation: "We were loosing" },
  { id: "via-2pl", category: "verb-imperfect", prompt: "Imperfect Active — 2nd Plural", answer: "ἔ- + stem + -ετε", hint: "Augment + ete", exampleWord: "ἐλύετε", translation: "You all were loosing" },
  { id: "via-3pl", category: "verb-imperfect", prompt: "Imperfect Active — 3rd Plural", answer: "ἔ- + stem + -ον", hint: "Same ending as 1sg — context distinguishes", exampleWord: "ἔλυον", translation: "They were loosing" },

  // Aorist Active
  { id: "vaa-1sg", category: "verb-aorist", prompt: "1st Aorist Active — 1st Singular", answer: "-σα", hint: "Sigma + alpha", exampleWord: "ἔλυσα", translation: "I loosed" },
  { id: "vaa-2sg", category: "verb-aorist", prompt: "1st Aorist Active — 2nd Singular", answer: "-σας", hint: "Sigma + alpha + sigma", exampleWord: "ἔλυσας", translation: "You loosed" },
  { id: "vaa-3sg", category: "verb-aorist", prompt: "1st Aorist Active — 3rd Singular", answer: "-σε(ν)", hint: "Sigma + epsilon", exampleWord: "ἔλυσε(ν)", translation: "He/she loosed" },
  { id: "vaa-1pl", category: "verb-aorist", prompt: "1st Aorist Active — 1st Plural", answer: "-σαμεν", hint: "Sigma + alpha + men", exampleWord: "ἐλύσαμεν", translation: "We loosed" },
  { id: "vaa-2pl", category: "verb-aorist", prompt: "1st Aorist Active — 2nd Plural", answer: "-σατε", hint: "Sigma + alpha + te", exampleWord: "ἐλύσατε", translation: "You all loosed" },
  { id: "vaa-3pl", category: "verb-aorist", prompt: "1st Aorist Active — 3rd Plural", answer: "-σαν", hint: "Sigma + alpha + nu", exampleWord: "ἔλυσαν", translation: "They loosed" },

  // Future Active
  { id: "vfa-1sg", category: "verb-future", prompt: "Future Active — 1st Singular", answer: "-σω", hint: "Sigma + omega", exampleWord: "λύσω", translation: "I will loose" },
  { id: "vfa-2sg", category: "verb-future", prompt: "Future Active — 2nd Singular", answer: "-σεις", hint: "Sigma + eis", exampleWord: "λύσεις", translation: "You will loose" },
  { id: "vfa-3sg", category: "verb-future", prompt: "Future Active — 3rd Singular", answer: "-σει", hint: "Sigma + ei", exampleWord: "λύσει", translation: "He/she will loose" },
  { id: "vfa-1pl", category: "verb-future", prompt: "Future Active — 1st Plural", answer: "-σομεν", hint: "Sigma + omen", exampleWord: "λύσομεν", translation: "We will loose" },
  { id: "vfa-2pl", category: "verb-future", prompt: "Future Active — 2nd Plural", answer: "-σετε", hint: "Sigma + ete", exampleWord: "λύσετε", translation: "You all will loose" },
  { id: "vfa-3pl", category: "verb-future", prompt: "Future Active — 3rd Plural", answer: "-σουσι(ν)", hint: "Sigma + ousi", exampleWord: "λύσουσιν", translation: "They will loose" },

  // Prepositions
  { id: "prep-en",    category: "preposition", prompt: "ἐν + [Case]", answer: "Dative", hint: "Meaning: in, on, at", exampleWord: "ἐν τῷ κόσμῳ", translation: "in the world" },
  { id: "prep-eis",   category: "preposition", prompt: "εἰς + [Case]", answer: "Accusative", hint: "Meaning: into, to, for", exampleWord: "εἰς τὴν πόλιν", translation: "into the city" },
  { id: "prep-ek",    category: "preposition", prompt: "ἐκ (ἐξ) + [Case]", answer: "Genitive", hint: "Meaning: out of, from", exampleWord: "ἐκ τῆς καρδίας", translation: "out of the heart" },
  { id: "prep-apo",   category: "preposition", prompt: "ἀπό + [Case]", answer: "Genitive", hint: "Meaning: from, away from", exampleWord: "ἀπὸ τοῦ θεοῦ", translation: "from God" },
  { id: "prep-pros",  category: "preposition", prompt: "πρός + [Case]", answer: "Accusative", hint: "Meaning: to, towards, with", exampleWord: "πρὸς τὸν θεόν", translation: "with God / towards God" },
  { id: "prep-dia-g", category: "preposition", prompt: "διά + Genitive", answer: "through", hint: "Note: διά + Accusative means 'because of'", exampleWord: "διὰ τοῦ προφήτου", translation: "through the prophet" },
  { id: "prep-dia-a", category: "preposition", prompt: "διά + Accusative", answer: "because of", hint: "Note: διά + Genitive means 'through'", exampleWord: "διὰ τὴν ἀγάπην", translation: "because of the love" },
  { id: "prep-meta-g", category: "preposition", prompt: "μετά + Genitive", answer: "with", hint: "Note: μετά + Accusative means 'after'", exampleWord: "μετὰ τῶν μαθητῶν", translation: "with the disciples" },
  { id: "prep-meta-a", category: "preposition", prompt: "μετά + Accusative", answer: "after", hint: "Note: μετά + Genitive means 'with'", exampleWord: "μετὰ ταῦτα", translation: "after these things" },
  { id: "prep-para-g", category: "preposition", prompt: "παρά + Genitive", answer: "from", hint: "Meaning: from (the side of)", exampleWord: "παρὰ τοῦ πατρός", translation: "from the Father" },
  { id: "prep-para-d", category: "preposition", prompt: "παρά + Dative", answer: "with / beside", hint: "Meaning: beside, in the presence of", exampleWord: "παρὰ τῷ θεῷ", translation: "with God" },
  { id: "prep-para-a", category: "preposition", prompt: "παρά + Accusative", answer: "beside / along", hint: "Meaning: beside, beyond, along", exampleWord: "παρὰ τὴν θάλασσαν", translation: "beside the sea" },
  { id: "prep-hupo-g", category: "preposition", prompt: "ὑπό + Genitive", answer: "by", hint: "Meaning: by (agency)", exampleWord: "ὑπὸ τοῦ κυρίου", translation: "by the Lord" },
  { id: "prep-hupo-a", category: "preposition", prompt: "ὑπό + Accusative", answer: "under", hint: "Meaning: under", exampleWord: "ὑπὸ τὸν νόμον", translation: "under the law" },
];

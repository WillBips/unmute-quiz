"use client";

import Image from "next/image";
import { CSSProperties, FormEvent, useState } from "react";

type OptionKey = "a" | "b" | "c" | "d";
type ProfileKey =
  | "perfectionist"
  | "translator"
  | "blankSlater"
  | "sensoryOverwhelmed";

const DUMMY_WEBHOOK_URL = "https://formspree.io/f/mgolnvzd";

const BASE_COPY = {
  en: {
    q1_title:
      "When a native speaker catches you off guard with a question, what does your brain do?",
    q1_a: "Panics about using the wrong verb tense.",
    q1_b: "Feverishly translates their words into my native language.",
    q1_c: "Goes completely blank. Total static.",
    q1_d: "Gets overwhelmed. It feels too loud and way too fast.",
    q2_title: "What does your current English practice actually look like?",
    q2_a: "Endless grammar drills on apps, but zero actual speaking.",
    q2_b: "Rehearsing exact conversations in the shower before they happen.",
    q2_c: "Dodging speaking practice completely. It’s just too stressful.",
    q2_d: "I can only practice in a perfectly quiet room with zero distractions.",
    q3_title:
      "You’re on a group Zoom call in English. What’s your survival strategy?",
    q3_a: "Stay muted unless I know my sentence is 100% grammatically flawless.",
    q3_b: "Run a 5-second delay while I translate everything in my head.",
    q3_c: "Pray to the Zoom gods that nobody asks for my opinion.",
    q3_d:
      "Feel completely drained trying to filter out the background noise.",
    q4_title: "You just made a mistake speaking English. What’s the fallout?",
    q4_a: "I cringe and dwell on it for hours.",
    q4_b:
      "I get frustrated because I knew the right word in my native language.",
    q4_c: "I panic, apologize, and try to escape the conversation.",
    q4_d: "My brain derails and I completely lose my train of thought.",
    q5_title: "What's your dream 'safety net' for practicing English?",
    q5_a: "A judgment-free buddy who ignores my grammar goofs.",
    q5_b: "A brain-hack that forces me to think in English, not translate.",
    q5_c: "A magic 'Undo' button for when my brain goes blank.",
    q5_d: "A perfectly calm zone where I set the speed limit.",
    email_hook:
      "Where should Mr Blue send your Friction Profile (and your custom unblocking plan)?",
    email_placeholder: "Enter your email address...",
    btn_submit: "Reveal My Profile",
    btn_founders: "Get Founder's Pass",
  },
  fr: {
    q1_title:
      "Quand un locuteur natif te pose une question à l'improviste, que fait ton cerveau ?",
    q1_a: "Il panique à l'idée d'utiliser le mauvais temps.",
    q1_b: "Il traduit frénétiquement ses mots dans ma langue maternelle.",
    q1_c: "Trou noir total. Plus aucune image ni son.",
    q1_d: "Il sature. Tout semble trop fort et beaucoup trop rapide.",
    q2_title:
      "À quoi ressemble réellement ta pratique de l'anglais aujourd'hui ?",
    q2_a:
      "Des exercices de grammaire à l'infini sur des applis, mais zéro oral.",
    q2_b:
      "Je répète des conversations exactes sous la douche avant qu'elles n'arrivent.",
    q2_c: "J'évite complètement de parler. C'est beaucoup trop stressant.",
    q2_d:
      "Je ne peux m'entraîner que dans une pièce parfaitement silencieuse, sans distraction.",
    q3_title:
      "Tu es en appel de groupe sur Zoom en anglais. Quelle est ta stratégie de survie ?",
    q3_a:
      "Rester en sourdine sauf si ma phrase est 100% parfaite grammaticalement.",
    q3_b: "Avoir 5 secondes de retard parce que je traduis tout dans ma tête.",
    q3_c:
      "Prier les dieux de Zoom pour que personne ne me demande mon avis.",
    q3_d:
      "Être complètement épuisé(e) à force d'essayer de filtrer le bruit de fond.",
    q4_title:
      "Tu viens de faire une erreur en parlant anglais. Quelles sont les conséquences ?",
    q4_a: "Je grimace et je ressasse ça pendant des heures.",
    q4_b: "Je suis frustré(e) car je connaissais le bon mot dans ma langue.",
    q4_c: "Je panique, je m'excuse et j'essaie de fuir la conversation.",
    q4_d:
      "Mon cerveau déraille et je perds complètement le fil de ma pensée.",
    q5_title:
      "Quel serait ton 'filet de sécurité' de rêve pour pratiquer l'anglais ?",
    q5_a: "Un partenaire sans jugement qui ignore mes fautes de grammaire.",
    q5_b:
      "Une astuce cérébrale qui me force à penser en anglais, sans traduire.",
    q5_c:
      "Un bouton magique 'Annuler' pour les moments où j'ai un trou noir.",
    q5_d: "Une zone parfaitement calme où je choisis la vitesse.",
    email_hook:
      "Où est-ce que Mr Bluu doit envoyer ton Profil de Blocage (et ton plan d'action personnalisé) ?",
    email_placeholder: "Ton adresse e-mail...",
    btn_submit: "Découvrir Mon Profil",
    btn_founders: "Obtenir le Founder's Pass",
  },
  es: {
    q1_title:
      "Cuando un hablante nativo te sorprende con una pregunta, ¿qué hace tu cerebro?",
    q1_a: "Entra en pánico por miedo a usar el tiempo verbal equivocado.",
    q1_b: "Traduce frenéticamente sus palabras a mi lengua materna.",
    q1_c: "Se queda totalmente en blanco. Estática pura.",
    q1_d: "Se abruma. Se siente demasiado ruidoso y demasiado rápido.",
    q2_title: "¿Cómo es realmente tu práctica actual de inglés?",
    q2_a: "Interminables ejercicios de gramática en apps, pero cero hablar.",
    q2_b: "Ensayo conversaciones exactas en la ducha antes de que ocurran.",
    q2_c: "Evito por completo practicar hablando. Me estresa demasiado.",
    q2_d:
      "Solo puedo practicar en una habitación perfectamente silenciosa sin distracciones.",
    q3_title:
      "Estás en una llamada grupal de Zoom en inglés. ¿Cuál es tu estrategia de supervivencia?",
    q3_a:
      "Mantenerme silenciado a menos que mi frase sea 100% gramaticalmente perfecta.",
    q3_b:
      "Llevar 5 segundos de retraso mientras traduzco todo en mi cabeza.",
    q3_c: "Rezar a los dioses de Zoom para que nadie me pida mi opinión.",
    q3_d:
      "Sentirme completamente agotado intentando filtrar el ruido de fondo.",
    q4_title:
      "Acabas de cometer un error hablando inglés. ¿Cuáles son las consecuencias?",
    q4_a: "Me muero de vergüenza y le doy vueltas durante horas.",
    q4_b: "Me frustro porque sabía la palabra correcta en mi idioma.",
    q4_c:
      "Entro en pánico, me disculpo e intento escapar de la conversación.",
    q4_d: "Mi cerebro se desconecta y pierdo por completo el hilo.",
    q5_title: "¿Cuál es tu 'red de seguridad' soñada para practicar inglés?",
    q5_a:
      "Un compañero que no me juzgue y pase por alto mis errores gramaticales.",
    q5_b:
      "Un truco mental que me obligue a pensar en inglés, no a traducir.",
    q5_c: "Un botón mágico de 'Deshacer' para cuando me quedo en blanco.",
    q5_d: "Una zona perfectamente tranquila donde yo marco la velocidad.",
    email_hook:
      "¿A dónde debería enviar Mr Bluu tu Perfil de Fricción (y tu plan de desbloqueo personalizado)?",
    email_placeholder: "Tu correo electrónico...",
    btn_submit: "Revelar Mi Perfil",
    btn_founders: "Conseguir Founder's Pass",
  },
  pt: {
    q1_title:
      "Quando um nativo te pega de surpresa com uma pergunta, o que o seu cérebro faz?",
    q1_a: "Entra em pânico com medo de errar o tempo verbal.",
    q1_b: "Traduz freneticamente as palavras dele para a minha língua.",
    q1_c: "Dá um branco total. Pura estática.",
    q1_d: "Fica sobrecarregado. Parece muito alto e rápido demais.",
    q2_title: "Como é a sua prática de inglês atualmente na vida real?",
    q2_a:
      "Infinitos exercícios de gramática em apps, mas zero conversação.",
    q2_b: "Ensaio conversas exatas no banho antes que elas aconteçam.",
    q2_c: "Evito completamente praticar a fala. É estressante demais.",
    q2_d:
      "Só consigo praticar num quarto perfeitamente silencioso, sem distrações.",
    q3_title:
      "Você está numa chamada de Zoom em grupo em inglês. Qual é a sua tática de sobrevivência?",
    q3_a:
      "Ficar no mudo a menos que minha frase esteja 100% perfeita na gramática.",
    q3_b:
      "Ficar com 5 segundos de atraso enquanto traduzo tudo na cabeça.",
    q3_c:
      "Rezar para os deuses do Zoom para que ninguém peça a minha opinião.",
    q3_d: "Me sentir esgotado tentando filtrar o barulho de fundo.",
    q4_title:
      "Você acabou de cometer um erro falando inglês. O que acontece depois?",
    q4_a: "Morro de vergonha e fico remoendo isso por horas.",
    q4_b:
      "Fico frustrado porque eu sabia a palavra certa na minha língua.",
    q4_c:
      "Entro em pânico, peço desculpas e tento fugir da conversa.",
    q4_d: "Meu cérebro desliga e perco completamente o fio da meada.",
    q5_title:
      "Qual seria a sua 'rede de segurança' dos sonhos para praticar inglês?",
    q5_a: "Um parceiro que não julga e ignora meus erros de gramática.",
    q5_b:
      "Um truque mental que me force a pensar em inglês, sem traduzir.",
    q5_c: "Um botão mágico de 'Desfazer' para quando me der um branco.",
    q5_d: "Uma zona perfeitamente calma onde eu defino a velocidade.",
    email_hook:
      "Para onde o Mr Bluu deve enviar o seu Perfil de Fricção (e seu plano de desbloqueio)?",
    email_placeholder: "Seu e-mail...",
    btn_submit: "Revelar Meu Perfil",
    btn_founders: "Garantir Founder's Pass",
  },
  ru: {
    q1_title:
      "Когда носитель языка застает тебя врасплох вопросом, что делает твой мозг?",
    q1_a: "Паникует из-за страха использовать не то время глагола.",
    q1_b: "Лихорадочно переводит его слова на родной язык.",
    q1_c: "Впадает в ступор. Полная пустота в голове.",
    q1_d:
      "Перегружается. Кажется, что всё слишком громко и слишком быстро.",
    q2_title:
      "Как на самом деле выглядит твоя текущая практика английского?",
    q2_a:
      "Бесконечные тесты по грамматике в приложениях, но ноль разговоров.",
    q2_b: "Репетирую точные диалоги в душе до того, как они произойдут.",
    q2_c:
      "Полностью избегаю разговорной практики. Это слишком большой стресс.",
    q2_d:
      "Могу практиковаться только в идеальной тишине без отвлекающих факторов.",
    q3_title:
      "Ты на групповом созвоне в Zoom на английском. Твоя стратегия выживания?",
    q3_a:
      "Сидеть с выключенным микрофоном, если только моя фраза не идеальна на 100%.",
    q3_b: "Отставать на 5 секунд, пока перевожу всё в уме.",
    q3_c: "Молиться богам Zoom, чтобы никто не спросил моё мнение.",
    q3_d:
      "Чувствовать полное истощение, пытаясь отфильтровать фоновый шум.",
    q4_title:
      "Ты только что ошибся, говоря по-английски. Какие последствия?",
    q4_a: "Сгораю от стыда и прокручиваю это в голове часами.",
    q4_b: "Злюсь, потому что знал правильное слово на родном языке.",
    q4_c: "Паникую, извиняюсь и пытаюсь сбежать от разговора.",
    q4_d: "Мозг отключается, и я полностью теряю нить разговора.",
    q5_title:
      "Какая 'страховка' для практики английского — твоя мечта?",
    q5_a:
      "Собеседник без осуждения, который игнорирует мои ошибки в грамматике.",
    q5_b:
      "Хак для мозга, заставляющий думать на английском, а не переводить.",
    q5_c: "Волшебная кнопка 'Отменить', когда в голове пусто.",
    q5_d:
      "Идеально спокойная зона, где я сам устанавливаю скорость.",
    email_hook:
      "Куда Мистер Блу должен отправить твой Профиль (и личный план разблокировки)?",
    email_placeholder: "Твой email...",
    btn_submit: "Узнать свой профиль",
    btn_founders: "Получить Founder's Pass",
  },
  ka: {
    q1_title:
      "როცა ინგლისურენოვანი ადამიანი მოულოდნელად კითხვას გისვამს, რა ემართება შენს ტვინს?",
    q1_a: "პანიკდება, რომ არასწორი ზმნის დრო არ გამოიყენოს.",
    q1_b:
      "გიჟივით იწყებს მის სიტყვების მშობლიურ ენაზე თარგმნას.",
    q1_c: "სრულიად ითიშება. აბსოლუტური სიცარიელე.",
    q1_d:
      "იბნევა. ყველაფერი ზედმეტად ხმამაღალი და სწრაფი ეჩვენება.",
    q2_title: "რეალურად როგორია შენი ინგლისურის პრაქტიკა ახლა?",
    q2_a:
      "უსასრულო გრამატიკული ტესტები აპლიკაციებში, მაგრამ ნულოვანი საუბარი.",
    q2_b:
      "შხაპის მიღებისას ზუსტი დიალოგების რეპეტიცია, სანამ ისინი რეალურად მოხდება.",
    q2_c:
      "საერთოდ გავურბივარ საუბრის პრაქტიკას. ზედმეტად სტრესულია.",
    q2_d:
      "ვარჯიში მხოლოდ აბსოლუტურად წყნარ ოთახში შემიძლია, ყურადღების გაფანტვის გარეშე.",
    q3_title:
      "Zoom-ის ჯგუფურ ზარზე ხარ ინგლისურად. როგორია შენი გადარჩენის სტრატეგია?",
    q3_a:
      "ჩუმად ყოფნა, სანამ ჩემს წინადადებაში გრამატიკულად 100%-ით დარწმუნებული არ ვარ.",
    q3_b: "5 წამით ჩამორჩენა, რადგან გონებაში ყველაფერს ვთარგმნი.",
    q3_c:
      "Zoom-ის ღმერთებისთვის ლოცვა, რომ არავინ მკითხოს აზრი.",
    q3_d:
      "სრული გამოფიტვა ფონური ხმაურის გაფილტვრის მცდელობისგან.",
    q4_title:
      "ინგლისურად საუბრისას ახლახან შეცდომა დაუშვი. რა ხდება მერე?",
    q4_a: "მრცხვენია და საათობით ამაზე ვფიქრობ.",
    q4_b:
      "ვბრაზდები, რადგან მშობლიურ ენაზე ზუსტი სიტყვა ვიცოდი.",
    q4_c:
      "პანიკაში ვვარდები, ბოდიშს ვიხდი და ვცდილობ საუბრიდან გავიქცე.",
    q4_d: "ტვინი მეთიშება და საუბრის ძაფს ვკარგავ.",
    q5_title:
      "როგორია შენი საოცნებო 'დამცავი ბადე' ინგლისურის პრაქტიკისთვის?",
    q5_a:
      "პარტნიორი, რომელიც არ განმსჯის და ჩემს გრამატიკულ შეცდომებს აიგნორებს.",
    q5_b:
      "გონებრივი ხრიკი, რომელიც მაიძულებს ინგლისურად ვიფიქრო და არა ვთარგმნო.",
    q5_c:
      "ჯადოსნური 'Undo' ღილაკი იმ მომენტებისთვის, როცა ტვინი მეთიშება.",
    q5_d:
      "აბსოლუტურად მშვიდი ზონა, სადაც სიჩქარეს მე ვაკონტროლებ.",
    email_hook:
      "სად გამოაგზავნოს მისტერ ბლუმ შენი პროფილი (და ბარიერის მოხსნის პერსონალური გეგმა)?",
    email_placeholder: "შენი ელ. ფოსტა...",
    btn_submit: "მაჩვენე ჩემი პროფილი",
    btn_founders: "მიიღე Founder's Pass",
  },
} as const;

const EXTRA_COPY = {
  profile_title: "Your Friction Profile",
  btn_back: "Go Back",
  result_image_alt: "Founder and Mr Blue",
} as const;

type Locale = keyof typeof BASE_COPY;
type Dictionary = (typeof BASE_COPY)["en"] & typeof EXTRA_COPY;
type DictionaryKey = keyof Dictionary;

const COPY: Record<Locale, Dictionary> = Object.fromEntries(
  Object.entries(BASE_COPY).map(([locale, value]) => [
    locale,
    { ...value, ...EXTRA_COPY },
  ]),
) as Record<Locale, Dictionary>;

const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
  es: "ES",
  pt: "PT",
  ru: "RU",
  ka: "KA",
};

const PROFILE_BY_OPTION: Record<OptionKey, ProfileKey> = {
  a: "perfectionist",
  b: "translator",
  c: "blankSlater",
  d: "sensoryOverwhelmed",
};

const PROFILE_DEFINITIONS: Record<
  ProfileKey,
  {
    profileName: string;
    description: string;
    coreFriction: string;
    emotionalTrigger: string;
    bestUnmuteFeatures: string;
  }
> = {
  perfectionist: {
    profileName: "The Perfectionist",
    description:
      "You know the rules, but the fear of breaking them keeps you silent.",
    coreFriction:
      "You filter everything through a harsh internal grammar-checker before speaking.",
    emotionalTrigger:
      "Making a mistake in front of a native speaker and feeling judged or foolish.",
    bestUnmuteFeatures:
      "Undo Buffer (to erase mistakes instantly) and Mission Cards (for structured, predictable practice).",
  },
  translator: {
    profileName: "The Mental Translator",
    description:
      "You have the vocabulary, but it's trapped behind a translation delay.",
    coreFriction:
      "You construct the sentence in your native language first, causing you to lag 5 seconds behind the conversation.",
    emotionalTrigger:
      "Fast-paced group settings where the topic changes before you finish translating your thought.",
    bestUnmuteFeatures:
      "Turtle Mode (slows the AI down to match your translation speed) and Mission Cards (short bursts of targeted practice).",
  },
  blankSlater: {
    profileName: "The Blank Slater",
    description:
      "You study hard, but pressure causes a complete system reboot.",
    coreFriction:
      "The moment a native speaker looks at you, your working memory wipes completely clean.",
    emotionalTrigger:
      "Being caught off guard or asked an unexpected question.",
    bestUnmuteFeatures:
      "Undo Buffer (removes the high stakes) and Focus Picker (eliminates choice paralysis so you can just hit 'start').",
  },
  sensoryOverwhelmed: {
    profileName: "The Sensory Overwhelmed",
    description:
      "Your brain works perfectly until the environment gets too loud.",
    coreFriction:
      "You cannot process a second language when there are visual distractions, background noises, or overlapping voices.",
    emotionalTrigger:
      "Chaotic UI, noisy environments, or rapid-fire questions.",
    bestUnmuteFeatures:
      "Focus Mode (strips the UI to bare text/audio) and Turtle Mode (controls the auditory pacing).",
  },
};

const PROFILE_RESULT_COPY: Record<
  ProfileKey,
  {
    headline: string;
    description: string;
    unblockingPlan: string[];
    cta: string;
  }
> = {
  perfectionist: {
    headline: "You're The Perfectionist.",
    description:
      "Here is what is happening: your brain cares so much about getting it right that it decides staying quiet is safer than making a mistake. You aren't lacking English skills; you are just lacking a safe place to fail.",
    unblockingPlan: [
      "The Undo Buffer: Speak freely. If you make a mistake, hit Undo. The AI forgets it ever happened.",
      "Mission Cards: Practice specific, low-stakes scenarios (like ordering coffee) so you always know what to say next.",
      "No Red Pen: Mr Blue doesn't correct you unless you ask him to.",
    ],
    cta: "Start Your Safe Practice (Get Founder's Pass)",
  },
  translator: {
    headline: "You're The Mental Translator.",
    description:
      "Here is what is happening: you have a massive English vocabulary, but you are forcing it through a translation tollbooth. You aren't bad at listening; your brain is just exhausted from doing double the work.",
    unblockingPlan: [
      "Turtle Mode: Slow Mr Blue down. Give your brain the extra seconds it needs to process without panic.",
      "Focus Picker: Pick one specific daily mission to build direct English-to-English reflexes.",
      "Scenario Reps: Repeat the same conversation until the translation step naturally fades away.",
    ],
    cta: "Build Your English Reflexes (Get Founder's Pass)",
  },
  blankSlater: {
    headline: "You're The Blank Slater.",
    description:
      "Here is what is happening: the pressure of a live conversation is triggering your fight-or-flight response, which temporarily shuts down your language center. You didn't forget your English; it's just temporarily locked.",
    unblockingPlan: [
      "The Undo Buffer: Lower the stakes to absolute zero. If you freeze, take a breath, hit Undo, and try again.",
      "Focus Picker: Stop worrying about \"what\" to study. Pick one card, and let the AI guide you.",
      "Turtle Mode: Take the speed pressure off completely.",
    ],
    cta: "Unfreeze Your English (Get Founder's Pass)",
  },
  sensoryOverwhelmed: {
    headline: "You're The Sensory Overwhelmed.",
    description:
      "Here is what is happening: processing a second language requires heavy cognitive load. When you add a busy interface, background noise, or speed to that, your brain simply protects itself by shutting down.",
    unblockingPlan: [
      "Focus Mode: Strip away the entire app interface. Just you, the text, and a calm voice. No distractions.",
      "Turtle Mode: Control the speed of the audio input so it never feels overwhelming.",
      "Bite-Sized Missions: 3-minute, highly controlled scenarios you can do in perfect quiet.",
    ],
    cta: "Enter the Calm Zone (Get Founder's Pass)",
  },
};

const PROFILE_EMAIL_TEMPLATES: Record<
  ProfileKey,
  {
    subject: string;
    body: string;
  }
> = {
  perfectionist: {
    subject: "Your Friction Profile is inside 🦍",
    body: `Hey [Name],
Will here - and Mr Blue says hi.
So you're a Perfectionist. Yeah... I taught English for 12 years across 60+ nationalities, and I've met hundreds of you. You're the one silently rehearsing a sentence while the conversation moves on without you. Every word gets run through this invisible grammar police in your head before it's allowed out.
Here's the thing - your English is fine. It's the fear of the red pen that's wrecking you.
That's why I built the Undo Buffer into Unmute. You mess up a verb tense? Hit a button. The AI forgets it happened. Gone. No judgment, no record, no cringing later.
Here's a 30-second video of me and Mr Blue showing you how it works: [Link to Video]
When you're ready to speak without the mental editor, grab your Founder's Pass here.
Talk soon,
Will & Mr Blue`,
  },
  translator: {
    subject: "Your Friction Profile is inside 🦍",
    body: `Hey [Name],
Will here - Mr Blue's waving at you right now.
So you're a Mental Translator. Exhausting, right? You know the words - that's not the issue. But everything goes through this loop: hear English -> translate to [your language] -> think of response -> translate back to English -> speak. By the time you open your mouth, the moment's gone.
You don't need more vocabulary. You need reps at YOUR speed so your brain stops translating and starts just... talking.
That's Turtle Mode. It slows the AI down so your brain gets breathing room. You build real-time reflexes without the panic of keeping up.
Here's 30 seconds of me and Mr Blue breaking it down: [Link to Video]
When you're ready to stop translating and start speaking, your Founder's Pass is here.
Talk soon,
Will & Mr Blue`,
  },
  blankSlater: {
    subject: "Your Friction Profile is inside 🦍",
    body: `Hey [Name],
Will here - Mr Blue's got your back on this one.
So you're a Blank Slater. Someone asks you a question in English, the pressure spikes, and suddenly every word you've ever learned just... vanishes. Total static. Like your brain hit the emergency shutdown button.
That's not a learning problem. That's a stress response. Your English is in there - it just hides when the stakes feel high.
So we killed the stakes. Unmute has an Undo Buffer - when your mind goes blank, you hit undo, take a breath, try again. No one knows. No one cares. The AI doesn't judge you, and honestly, neither does Mr Blue.
Here's 30 seconds of us explaining it: [Link to Video]
When you're ready to unfreeze, your Founder's Pass is here.
Talk soon,
Will & Mr Blue`,
  },
  sensoryOverwhelmed: {
    subject: "Your Friction Profile is inside 🦍",
    body: `Hey [Name],
Will here - Mr Blue wanted me to keep this one short and calm. So I will.
You're Sensory Overwhelmed. Speaking a second language already takes a LOT of mental bandwidth. Now add a cluttered app, fast audio, notifications, bright colors - and your brain just goes "nope" and shuts the whole thing down. Totally normal.
Unmute was built to be quiet. Focus Mode strips out all the visual noise. Turtle Mode slows everything down. It's just you, the AI, and a conversation at whatever pace your brain needs.
No chaos. No overwhelm. Just practice.
Here's 30 seconds of me and Mr Blue in the calm zone: [Link to Video]
When you're ready to step in, your Founder's Pass is here.
Talk soon,
Will & Mr Blue`,
  },
};

function scoreAnswers(answers: OptionKey[]) {
  const scores: Record<ProfileKey, number> = {
    perfectionist: 0,
    translator: 0,
    blankSlater: 0,
    sensoryOverwhelmed: 0,
  };

  answers.forEach((answer) => {
    scores[PROFILE_BY_OPTION[answer]] += 1;
  });

  return scores;
}

function resolveWinningProfile(answers: OptionKey[]): ProfileKey {
  const scores = scoreAnswers(answers);
  const entries = Object.entries(scores) as [ProfileKey, number][];
  const maxScore = Math.max(...entries.map(([, value]) => value));
  const tied = entries
    .filter(([, value]) => value === maxScore)
    .map(([key]) => key);

  if (tied.length === 1) return tied[0];

  const finalAnswer = answers[4] ?? answers[answers.length - 1];
  const tieBreakerProfile = finalAnswer ? PROFILE_BY_OPTION[finalAnswer] : null;
  if (tieBreakerProfile && tied.includes(tieBreakerProfile)) {
    return tieBreakerProfile;
  }

  return tied[0];
}

export default function Page() {
  const [locale, setLocale] = useState<Locale>("en");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<OptionKey[]>([]);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phase, setPhase] = useState<"quiz" | "email" | "result">("quiz");
  const [winningProfile, setWinningProfile] = useState<ProfileKey | null>(null);

  const t = (key: DictionaryKey) => COPY[locale][key] ?? COPY.en[key];

  const questions = [1, 2, 3, 4, 5].map((n) => ({
    title: t(`q${n}_title` as DictionaryKey),
    options: {
      a: t(`q${n}_a` as DictionaryKey),
      b: t(`q${n}_b` as DictionaryKey),
      c: t(`q${n}_c` as DictionaryKey),
      d: t(`q${n}_d` as DictionaryKey),
    } as Record<OptionKey, string>,
  }));

  const currentQuestion = questions[questionIndex];
  const progress =
    phase === "quiz" ? ((questionIndex + 1) / questions.length) * 100 : 100;
  const winningResult = winningProfile ? PROFILE_RESULT_COPY[winningProfile] : null;

  const handleSelectAnswer = (choice: OptionKey) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[questionIndex] = choice;
      return next;
    });

    if (questionIndex === questions.length - 1) {
      setTimeout(() => setPhase("email"), 120);
      return;
    }

    setTimeout(() => setQuestionIndex((prev) => prev + 1), 120);
  };

  const handleGoBack = () => {
    if (phase === "quiz" && questionIndex > 0) {
      setQuestionIndex((prev) => Math.max(prev - 1, 0));
      return;
    }

    if (phase === "email") {
      setPhase("quiz");
      setQuestionIndex(questions.length - 1);
    }
  };

  const handleSubmitEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (answers.length !== questions.length) return;

    const profile = resolveWinningProfile(answers);
    const payload = {
      email: email.trim(),
      locale,
      answers,
      scores: scoreAnswers(answers),
      profile,
      profileDefinition: PROFILE_DEFINITIONS[profile],
      profileResultCopy: PROFILE_RESULT_COPY[profile],
      profileEmailTemplate: PROFILE_EMAIL_TEMPLATES[profile],
      submittedAt: new Date().toISOString(),
    };

    setIsSubmitting(true);

    await Promise.allSettled([
      fetch(DUMMY_WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify(payload),
      }),
      new Promise((resolve) => setTimeout(resolve, 900)),
    ]);

    setWinningProfile(profile);
    setPhase("result");
    setIsSubmitting(false);
  };

  const themeVars: CSSProperties = {
    ["--mr-blue" as string]: "#78BDF2",
    ["--unmute-blue" as string]: "#2E63E9",
    ["--ink" as string]: "#111827",
    ["--muted" as string]: "#6B7280",
    ["--line" as string]: "#D9E2F1",
    ["--soft-blue" as string]: "#ECF3FF",
    ["--page-bg" as string]: "#F6F8FC",
  };

  return (
    <section
      style={themeVars}
      className="relative min-h-screen bg-[var(--page-bg)] px-3 py-4 font-sans text-[var(--ink)] sm:px-4 sm:py-8"
    >
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-4 flex justify-end sm:mb-6">
          <label htmlFor="language" className="sr-only">
            Language
          </label>
          <select
            id="language"
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
            className="rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus-visible:ring-4 focus-visible:ring-[var(--mr-blue)]/35"
          >
            {(Object.keys(LOCALE_LABELS) as Locale[]).map((lang) => (
              <option key={lang} value={lang}>
                {LOCALE_LABELS[lang]}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-[0_12px_36px_-20px_rgba(46,99,233,0.35)] sm:rounded-3xl">
          <div className="h-2 w-full bg-slate-100">
            <div
              className="h-full bg-[var(--unmute-blue)] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="p-4 sm:p-6 md:p-8">
            {phase === "quiz" && (
              <article key={`${locale}-${questionIndex}`} className="space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold text-slate-500 sm:text-sm">
                    {`Q${questionIndex + 1} / ${questions.length}`}
                  </p>
                  {questionIndex > 0 && (
                    <button
                      type="button"
                      onClick={handleGoBack}
                      className="inline-flex min-h-10 items-center justify-center rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--mr-blue)]/35 sm:text-sm"
                    >
                      {t("btn_back")}
                    </button>
                  )}
                </div>

                <h2 className="text-xl font-extrabold leading-tight sm:text-2xl md:text-3xl">
                  {currentQuestion.title}
                </h2>

                <div
                  role="radiogroup"
                  aria-label={currentQuestion.title}
                  className="space-y-3"
                >
                  {(["a", "b", "c", "d"] as OptionKey[]).map((choice) => (
                    <button
                      key={choice}
                      type="button"
                      onClick={() => handleSelectAnswer(choice)}
                      className="group flex min-h-12 w-full items-start gap-3 rounded-2xl border border-[var(--line)] bg-white px-3 py-3 text-left transition hover:border-[var(--mr-blue)] hover:bg-[var(--soft-blue)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--mr-blue)]/35 sm:px-4"
                    >
                      <span className="mt-0.5 inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-slate-700 px-1.5 text-xs font-bold uppercase text-white group-hover:bg-[var(--unmute-blue)]">
                        {choice}
                      </span>
                      <span className="text-sm leading-relaxed text-slate-800 sm:text-base">
                        {currentQuestion.options[choice]}
                      </span>
                    </button>
                  ))}
                </div>
              </article>
            )}

            {phase === "email" && (
              <article className="space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-slate-500 sm:text-sm">
                    {`Q${questions.length} / ${questions.length}`}
                  </span>
                  <button
                    type="button"
                    onClick={handleGoBack}
                    className="inline-flex min-h-10 items-center justify-center rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--mr-blue)]/35 sm:text-sm"
                  >
                    {t("btn_back")}
                  </button>
                </div>

                <h2 className="text-xl font-extrabold leading-tight sm:text-2xl md:text-3xl">
                  {t("email_hook")}
                </h2>

                <form className="space-y-4" onSubmit={handleSubmitEmail}>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("email_placeholder")}
                    className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus-visible:ring-4 focus-visible:ring-[var(--mr-blue)]/35"
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-[var(--unmute-blue)] px-6 py-3 text-base font-extrabold text-white shadow-[0_10px_20px_-12px_rgba(46,99,233,0.8)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--mr-blue)]/35 sm:min-w-44 sm:w-auto"
                  >
                    {isSubmitting ? (
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/50 border-t-white" />
                    ) : (
                      t("btn_submit")
                    )}
                  </button>
                </form>
              </article>
            )}

            {phase === "result" && winningProfile && (
              <article className="space-y-5 text-center">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--unmute-blue)]">
                  {t("profile_title")}
                </p>

                <div className="mx-auto w-full max-w-xl overflow-hidden rounded-3xl border border-[var(--line)] bg-slate-100 shadow-[0_12px_30px_-18px_rgba(0,0,0,0.35)]">
                  <div className="relative aspect-[4/5] sm:aspect-[16/10]">
                    <Image
                      src="/mr-bluu-founder.jpg"
                      alt={t("result_image_alt")}
                      fill
                      priority
                      sizes="(max-width: 640px) 100vw, 640px"
                      className="object-cover object-[50%_30%] scale-[1.06]"
                    />
                  </div>
                </div>

                <h2 className="text-2xl font-black leading-tight sm:text-3xl md:text-4xl">
                  {winningResult?.headline}
                </h2>

                <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                  {winningResult?.description}
                </p>

                <div className="mx-auto w-full max-w-xl rounded-2xl border border-[var(--line)] bg-[var(--soft-blue)] p-4 text-left sm:p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--unmute-blue)] sm:text-sm">
                    Your Unblocking Plan:
                  </p>
                  <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-slate-700 sm:text-base">
                    {winningResult?.unblockingPlan.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                </div>

                <a
                  href="https://unmute.today"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-[var(--unmute-blue)] px-7 py-3 text-base font-extrabold text-white shadow-[0_10px_20px_-12px_rgba(46,99,233,0.8)] transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--mr-blue)]/35 sm:w-auto"
                >
                  {winningResult?.cta}
                </a>
              </article>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

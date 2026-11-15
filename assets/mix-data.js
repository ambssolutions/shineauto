/* One source for the section picker (mix.html): which sections exist, and where each design keeps them.
   sel is one selector for every design, or a map of design -> selector. Thumbnails: designs/<slug>/sec-<key>.webp
   (made by tools/section-thumbs.mjs). */
window.MIX = {
  designs: [
    ['01-roller-door', 'Roller Door'], ['02-number-plate', 'Number Plate'], ['03-job-card', 'Job Card'],
    ['04-dashboard', 'Dashboard'], ['05-pressed-metal', 'Pressed Metal']
  ],
  sections: [
    { key: 'style', name: 'Overall look', sel: '#top', thumb: 'hero', note: 'Colours, type, buttons and surfaces for the whole site. Whichever sections you pick below are redrawn in this look so the site feels like one piece.' },
    { key: 'hero', name: 'First screen', sel: '#top', note: 'The headline, the call button and the signature opening animation.' },
    { key: 'lights', name: 'Dashboard warning lights', sel: '#lights', only: ['04-dashboard'], optional: true, note: '"What\'s that light on your dash?": nine warning lights, what each means, whether to keep driving and which service fixes it.' },
    { key: 'services', name: 'Services', sel: { '01-roller-door': '#services', '02-number-plate': '#services', '03-job-card': '#work', '04-dashboard': '#services', '05-pressed-metal': '#services' }, note: 'The seven services from the business card.' },
    { key: 'break', name: 'Full-width photo break', sel: '#break', only: ['05-pressed-metal'], optional: true, note: '"Quality work guaranteed" set big over the tyre photo.' },
    { key: 'inspect', name: '3D pink slip car', sel: '#inspect', only: ['05-pressed-metal'], optional: true, note: 'The 3D car you can turn, with the nine pink slip check points.' },
    { key: 'checklist', name: 'Pink slip checklist', sel: '#pink', only: ['03-job-card'], optional: true, note: 'The checklist that ticks itself and ends with a PASSED (example) stamp.' },
    { key: 'slips', name: 'Pink or blue slip and fees', sel: { '01-roller-door': '#slips', '02-number-plate': '#slips', '03-job-card': '#fees', '04-dashboard': '#slips', '05-pressed-metal': '#slips' }, note: 'Which slip you need, the $52 and $82 NSW fees and the free recheck within 14 days.' },
    { key: 'job', name: 'How a job goes', sel: { '01-roller-door': '#job', '02-number-plate': '#job', '03-job-card': '#job', '04-dashboard': '#how', '05-pressed-metal': '#job' }, note: 'Call, drop it at Unit 4B, we do the work, pick it up.' },
    { key: 'rating', name: 'Rating', sel: { '01-roller-door': '#rating', '02-number-plate': '#rating', '03-job-card': '#reviews', '04-dashboard': '#rating', '05-pressed-metal': '#rating' }, note: '4.8 from 57 reviews.' },
    { key: 'faq', name: 'Questions', sel: '#faq', note: 'Common questions with slow-opening answers.' },
    { key: 'visit', name: 'Hours and address', sel: { '01-roller-door': '#hours', '02-number-plate': '#visit', '03-job-card': '#visit', '04-dashboard': '#find', '05-pressed-metal': '#visit' }, note: 'Opening hours with today marked, the address, both phones and directions.' },
    { key: 'band', name: 'Final call', sel: { '01-roller-door': '.endband', '02-number-plate': '.band', '03-job-card': '#call', '04-dashboard': '#call', '05-pressed-metal': '.band' }, note: 'The last nudge to call before the footer.' },
    { key: 'footer', name: 'Footer', sel: 'footer', note: 'The closing section with the address, phones and credits.' }
  ]
};
window.MIX.selFor = function (s, slug) { return typeof s.sel === 'string' ? s.sel : s.sel[slug]; };

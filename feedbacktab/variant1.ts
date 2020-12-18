(function () {
  function setCookie(cname, cvalue, exhours) {
    var d = new Date();
    d.setTime(d.getTime() + exhours * 60 * 60 * 1000);
    var expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
  }

  function getCookie(cname) {
    var name = cname + '=';
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return undefined;
  }

  const label = document.querySelector(
    '._hj-f5b2a1eb-9b07_feedback_minimized_label'
  );
  const labelText = document.querySelector(
    '._hj-f5b2a1eb-9b07_feedback_minimized_label_text'
  );

  const loggedin = coopUserSettings.isAuthenticated;
  const cookie = getCookie('HideFeedback');

  const labelIcon = document.createElement('div');
  labelIcon.classList.add('label_icon');
  labelIcon.innerHTML = `
  <svg width="4" height="15" viewBox="0 0 4 15" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M3.75281 14.7397C3.86517 14.3592 3.8427 13.9587 3.8427 13.5782C3.86517 13.0976 3.93258 12.5969 3.86517 12.1163C3.77528 11.7559 3.68539 11.5356 3.48315 11.5356C2.96629 11.5156 2.53933 11.4955 2.02247 11.5356C1.57303 11.4755 1.05618 11.4154 0.651685 11.4555C0.426966 11.4955 0.292135 11.6157 0.247191 11.7759C0.269663 12.2165 0.314607 12.637 0.224719 13.0776L0.179775 14.4193C0.247191 14.6796 0.35955 14.8398 0.539326 14.9399L2.62921 15C3.03371 14.9599 3.41573 14.8999 3.75281 14.7397ZM3.93258 0.421446C3.93258 0.221191 3.75281 0.101039 3.32584 0.0209365C2.85393 0.000911287 2.42697 0.0209366 2.02247 0.0609883C1.4382 0.000911418 0.831461 -0.0391402 0.247191 0.0609883C0.0674156 0.401421 -9.3016e-08 0.741854 0.0674156 1.08229L0.0898877 3.70563L0 7.49044V9.41289C0.0224718 9.63317 0.0449437 9.85345 0.247191 10.0737C0.808989 10.1739 1.34831 10.0938 1.91011 10.0337L3.4382 10.0137C3.73034 9.9736 4 9.8134 4 9.57309V7.02986L3.95506 5.38777L3.93258 3.00473V0.421446Z" fill="white"/>
  </svg>`;
  label.insertBefore(labelIcon, label.firstChild);

  const labelClose = document.createElement('div');
  labelClose.classList.add('label_close');
  labelClose.innerHTML = `
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M1 11L11 1" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M11 11L1 1" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
  label.appendChild(labelClose);

  labelText.innerText = 'Tyck till';

  setTimeout(() => {
    if (!loggedin && !cookie) {
      label.classList.add('label--show');
    }
  }, 5000);

  labelIcon.addEventListener('click', (event) => {
    event.stopPropagation();
    label.classList.toggle('label--show');
  });

  labelClose.addEventListener('click', (event) => {
    event.stopPropagation();
    label.classList.remove('label--show');
    setCookie('HideFeedback', true, 12);
  });

  const feedbackStyle = document.createElement('style');
  feedbackStyle.innerHTML = `

#_hj-f5b2a1eb-9b07_feedback ._hj-f5b2a1eb-9b07_feedback_minimized_label {
  position: absolute;
  top: 40%;
  display: flex;
  width: 200px;
  align-items: center;
  padding: unset;
  background: #005537;
  box-shadow: 0 0 35px 2px rgba(0, 0, 0, 0.24);
  color: white;
  transform: unset;
}

#_hj-f5b2a1eb-9b07_feedback[data-minimized-position='middle_right']
  ._hj-f5b2a1eb-9b07_feedback_minimized_label {
  right: -182px;
  border-radius: 8px 0 0 8px;
}

#_hj-f5b2a1eb-9b07_feedback[data-minimized-position='middle_right']
  ._hj-f5b2a1eb-9b07_feedback_minimized_label:hover {
  right: -182px;
}

._hj-f5b2a1eb-9b07_feedback_minimized_label.label--show {
  right: 0 !important;
}

#_hj-f5b2a1eb-9b07_feedback
  ._hj-f5b2a1eb-9b07_feedback_minimized_label
  ._hj-f5b2a1eb-9b07_feedback_minimized_label_text {
  flex-grow: 1;
  padding: 10px;
  font-family: Akkurat !important;
  font-size: 16px;
  line-height: 20px;
  text-decoration: underline;
  transform: unset;
  writing-mode: unset;
}

._hj-f5b2a1eb-9b07_feedback_minimized_label .label_icon {
  display: flex;
  width: 18px;
  align-items: center;
  align-self: stretch;
  justify-content: center;
  border-radius: 8px 0 0 8px;
  cursor: pointer;
}

._hj-f5b2a1eb-9b07_feedback_minimized_label .label_close {
  padding: 14px !important;
  cursor: pointer;
}

._hj-f5b2a1eb-9b07_feedback_minimized_label .label_close svg {
  display: block;
}

`;
  label.appendChild(feedbackStyle);

  setTimeout(() => {
    label.style.transition = 'right 400ms';
  }, 1);
})();

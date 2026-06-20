(function () {
  const source = window.MED_CONFIG || {};
  const working = typeof structuredClone === "function"
    ? structuredClone(source)
    : JSON.parse(JSON.stringify(source));

  const state = {
    month: startOfMonth(new Date()),
    outputMode: "js",
    outputName: "site-config.js"
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    fillForm();
    renderWeekdayControls();
    bindInputs();
    renderCalendar();
    exportOutput("js");
    refreshIcons();
  }

  function fillForm() {
    const form = $("#adminForm");
    if (!form) return;
    form.elements.whatsapp.value = working.contact?.whatsapp || "";
    form.elements.phone.value = working.contact?.phone || "";
    form.elements.inspectionFee.value = working.payment?.inspectionFee || "";
    setFormValue(form, "vodafoneCash", working.payment?.vodafoneCash || "");
    setFormValue(form, "instapay", working.payment?.instapay || "");
    setFormValue(form, "bankTransfer", working.payment?.bankTransfer || "");
    form.elements.defaultSlots.value = (working.availability?.defaultSlots || []).join(", ");
    form.elements.unavailableDates.value = (working.availability?.unavailableDates || []).join("\n");
    form.elements.dateSlots.value = JSON.stringify(working.availability?.dateSlots || {}, null, 2);
    form.elements.blockedSlots.value = JSON.stringify(working.availability?.blockedSlots || {}, null, 2);
  }

  function renderWeekdayControls() {
    const holder = $("#weekdayAdmin");
    if (!holder) return;
    const labels = working.content?.ar?.calendar?.weekdays || ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const active = new Set(working.availability?.availableWeekdays || []);
    holder.innerHTML = labels
      .map((label, index) => `
        <label>
          <input type="checkbox" name="weekday" value="${index}" ${active.has(index) ? "checked" : ""}>
          <span>${escapeHtml(label)}</span>
        </label>
      `)
      .join("");
  }

  function bindInputs() {
    const form = $("#adminForm");
    if (!form) return;

    form.addEventListener("input", () => {
      syncFromForm();
      renderCalendar();
      exportOutput(state.outputMode);
    });

    form.addEventListener("change", () => {
      syncFromForm();
      renderCalendar();
      exportOutput(state.outputMode);
    });

    $("[data-admin-prev]")?.addEventListener("click", () => {
      state.month = new Date(state.month.getFullYear(), state.month.getMonth() - 1, 1);
      renderCalendar();
    });

    $("[data-admin-next]")?.addEventListener("click", () => {
      state.month = new Date(state.month.getFullYear(), state.month.getMonth() + 1, 1);
      renderCalendar();
    });

    $("[data-export-js]")?.addEventListener("click", () => exportOutput("js"));
    $("[data-export-json]")?.addEventListener("click", () => exportOutput("json"));
    $("[data-copy-output]")?.addEventListener("click", copyOutput);
    $("[data-download-output]")?.addEventListener("click", downloadOutput);
  }

  function syncFromForm() {
    const form = $("#adminForm");
    if (!form) return false;
    ensureObjects();

    working.contact.whatsapp = form.elements.whatsapp.value.trim();
    working.contact.phone = form.elements.phone.value.trim();
    working.payment.inspectionFee = form.elements.inspectionFee.value.trim();
    if (form.elements.vodafoneCash) working.payment.vodafoneCash = form.elements.vodafoneCash.value.trim();
    if (form.elements.instapay) working.payment.instapay = form.elements.instapay.value.trim();
    if (form.elements.bankTransfer) working.payment.bankTransfer = form.elements.bankTransfer.value.trim();
    working.availability.defaultSlots = splitList(form.elements.defaultSlots.value);
    working.availability.unavailableDates = parseDates(form.elements.unavailableDates.value);
    working.availability.availableWeekdays = $$('input[name="weekday"]:checked', form)
      .map((input) => Number(input.value))
      .sort((a, b) => a - b);

    try {
      working.availability.dateSlots = JSON.parse(form.elements.dateSlots.value || "{}");
      working.availability.blockedSlots = JSON.parse(form.elements.blockedSlots.value || "{}");
      setStatus("تم تحديث القيم داخل الصفحة. استخدم Export للحصول على الملف الجديد.", true);
      return true;
    } catch (error) {
      setStatus("صيغة JSON في المواعيد الخاصة أو المحجوزة غير صحيحة.", false);
      return false;
    }
  }

  function ensureObjects() {
    working.contact = working.contact || {};
    working.payment = working.payment || {};
    working.availability = working.availability || {};
  }

  function setFormValue(form, name, value) {
    if (form.elements[name]) form.elements[name].value = value;
  }

  function renderCalendar() {
    const title = $("[data-admin-calendar-title]");
    const weekdays = $("[data-admin-weekdays]");
    const grid = $("[data-admin-calendar]");
    if (!title || !weekdays || !grid) return;

    const months = working.content?.ar?.calendar?.months || [];
    const weekdayLabels = working.content?.ar?.calendar?.weekdays || [];
    const year = state.month.getFullYear();
    const month = state.month.getMonth();
    title.textContent = `${months[month] || month + 1} ${year}`;
    weekdays.innerHTML = weekdayLabels.map((day) => `<span>${escapeHtml(day)}</span>`).join("");

    const first = new Date(year, month, 1);
    const days = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let index = 0; index < first.getDay(); index += 1) {
      cells.push('<span class="calendar-day is-empty"></span>');
    }

    for (let day = 1; day <= days; day += 1) {
      const date = new Date(year, month, day);
      const iso = toISO(date);
      const blocked = (working.availability?.unavailableDates || []).includes(iso);
      const weekdayAllowed = (working.availability?.availableWeekdays || []).includes(date.getDay());
      cells.push(`
        <button class="calendar-day ${blocked || !weekdayAllowed ? "is-disabled" : ""}" type="button" data-admin-date="${iso}">
          ${day}
        </button>
      `);
    }

    grid.innerHTML = cells.join("");
    $$("[data-admin-date]", grid).forEach((button) => {
      button.addEventListener("click", () => toggleUnavailableDate(button.dataset.adminDate));
    });
  }

  function toggleUnavailableDate(iso) {
    ensureObjects();
    const dates = new Set(working.availability.unavailableDates || []);
    if (dates.has(iso)) {
      dates.delete(iso);
    } else {
      dates.add(iso);
    }
    working.availability.unavailableDates = [...dates].sort();
    const form = $("#adminForm");
    if (form) form.elements.unavailableDates.value = working.availability.unavailableDates.join("\n");
    renderCalendar();
    exportOutput(state.outputMode);
  }

  function exportOutput(mode) {
    if (!syncFromForm()) return;
    state.outputMode = mode;
    state.outputName = mode === "json" ? "site-config.json" : "site-config.js";
    const output = $("[data-output]");
    if (!output) return;
    output.value = mode === "json"
      ? `${JSON.stringify(working, null, 2)}\n`
      : `window.MED_CONFIG = ${JSON.stringify(working, null, 2)};\n`;
    setStatus(mode === "json" ? "تم تجهيز JSON." : "تم تجهيز ملف site-config.js.", true);
  }

  async function copyOutput() {
    const output = $("[data-output]");
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output.value);
      setStatus("تم النسخ.", true);
    } catch (error) {
      output.select();
      document.execCommand("copy");
      setStatus("تم تحديد النص ونسخه قدر الإمكان.", true);
    }
  }

  function downloadOutput() {
    const output = $("[data-output]");
    if (!output) return;
    const blob = new Blob([output.value], { type: state.outputMode === "json" ? "application/json" : "text/javascript" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = state.outputName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function setStatus(message, ok) {
    const status = $("[data-admin-status]");
    if (!status) return;
    status.textContent = message;
    status.style.color = ok ? "var(--accent-2)" : "var(--accent-3)";
  }

  function splitList(value) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function parseDates(value) {
    return value
      .split(/[\s,]+/)
      .map((item) => item.trim())
      .filter((item) => /^\d{4}-\d{2}-\d{2}$/.test(item))
      .sort();
  }

  function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  function toISO(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function refreshIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
})();

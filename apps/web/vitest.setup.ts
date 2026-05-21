import '@testing-library/jest-dom/vitest';

// jsdom does not implement the native <dialog> API (showModal / close).
// Polyfill both methods so any component that wraps Modal doesn't crash.
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '');
  };
}
if (!HTMLDialogElement.prototype.close) {
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open');
  };
}

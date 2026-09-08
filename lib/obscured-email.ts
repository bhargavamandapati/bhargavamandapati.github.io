/**
 * The address behind the "email for access" buttons, reconstructed at runtime
 * from character codes rather than kept as a literal string anywhere in the
 * source.
 *
 * A `mailto:someone@example.com` sitting in a page — or even in the shipped
 * JS as a string constant — is exactly the pattern an address harvester's
 * regex is built to find. Splitting it into codes defeats that: nothing in
 * the built output is a string that looks like an email address until a
 * reader's own browser reassembles it, and it is reassembled only inside a
 * click handler, never rendered into an attribute or into text.
 */
const CODES = [
  98, 104, 97, 114, 103, 97, 118, 97, 109, 97, 110, 100, 97, 112, 97, 116, 105, 64, 103, 109, 97,
  105, 108, 46, 99, 111, 109,
]

export function accessEmail(): string {
  return String.fromCharCode(...CODES)
}

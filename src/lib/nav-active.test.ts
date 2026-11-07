import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isNavItemActive } from './nav-active.ts';

const services = { href: '/services', children: [{ href: '/theater' }, { href: '/artistic' }, { href: '/movement-dance' }] };

test('a section is current on its own page and on its submenu pages', () => {
  assert.ok(isNavItemActive(services, '/services'));
  assert.ok(isNavItemActive(services, '/theater'));
  assert.ok(!isNavItemActive(services, '/about'));
});

test('event detail and booking pages keep "Events" current', () => {
  assert.ok(isNavItemActive({ href: '/events' }, '/events/douala-manga-bell'));
  assert.ok(isNavItemActive({ href: '/events' }, '/events/tam-tam/booking'));
  assert.ok(!isNavItemActive({ href: '/events' }, '/eventsx'));
});

test('home is only current on the home page', () => {
  assert.ok(isNavItemActive({ href: '/' }, '/'));
  assert.ok(!isNavItemActive({ href: '/' }, '/about'));
});

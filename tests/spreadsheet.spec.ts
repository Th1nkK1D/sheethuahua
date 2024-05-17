import { describe, expect, it } from 'bun:test';
import { Spreadsheet, Table } from '../src';
import { mockFetch } from './setup';

describe('Spreadsheet.get', () => {
	const tableName = 'Users';
	const sheetsId = 'some-sheets-id';

	it('should fetch with given sheetsId', async () => {
		const sheets = Spreadsheet(sheetsId, [Table(tableName, {})]);

		mockFetch.mockResolvedValue(new Response('id,value\n0,a'));

		await sheets.get(tableName);

		const requestedURL = mockFetch.mock.lastCall?.[0];

		expect(requestedURL).toInclude(sheetsId);
	});

	it('should include sheet from given table name and csv export type from fetch query', async () => {
		const sheets = Spreadsheet(sheetsId, [Table(tableName, {})]);

		mockFetch.mockResolvedValue(new Response('id,value\n0,a'));

		await sheets.get(tableName);

		const queryParams = new URLSearchParams(
			mockFetch.mock.lastCall?.[0].split('?')[1],
		);

		expect(queryParams.length).toBe(2);
		expect(queryParams.get('sheet')).toBe(tableName);
		expect(queryParams.get('tqx')).toBe('out:csv');
	});

	it('should include range and headers in fetch query if specified', async () => {
		const range = 'A1:ZZZ999';
		const headers = 2;

		const sheets = Spreadsheet(sheetsId, [Table(tableName, {})], {
			range,
			headers,
		});

		mockFetch.mockResolvedValue(new Response('id,value\n0,a'));

		await sheets.get(tableName, {});

		const queryParams = new URLSearchParams(
			mockFetch.mock.lastCall?.[0].split('?')[1],
		);

		expect(queryParams.length).toBe(4);
		expect(queryParams.get('sheet')).toBe(tableName);
		expect(queryParams.get('tqx')).toBe('out:csv');
	});

	it('should overwrite global options with get options if given', async () => {
		const range = 'A1:ZZZ999';
		const headers = 2;

		const sheets = Spreadsheet(sheetsId, [Table(tableName, {})], {
			range: 'A:B',
			headers: 1,
		});

		mockFetch.mockResolvedValue(new Response('id,value\n0,a'));

		await sheets.get(tableName, { range, headers });

		const queryParams = new URLSearchParams(
			mockFetch.mock.lastCall?.[0].split('?')[1],
		);

		expect(queryParams.length).toBe(4);
		expect(queryParams.get('sheet')).toBe(tableName);
		expect(queryParams.get('tqx')).toBe('out:csv');
	});
});

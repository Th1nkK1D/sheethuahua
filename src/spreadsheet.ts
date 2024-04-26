import {
	Type,
	type Intersect,
	type Static,
	type TIndexFromPropertyKey,
	type TKeyOf,
} from '@sinclair/typebox';
import { parseCSVFromUrl } from './parser';
import type { TTable } from './table';

export function Spreadsheet<T extends TTable<any, any>[]>(
	sheetsId: string,
	tables: [...T],
) {
	const tablesSchema = Type.Intersect(tables);

	return {
		get<N extends Static<TKeyOf<typeof tablesSchema>>>(
			tableName: N,
		): Promise<Static<TIndexFromPropertyKey<Intersect<T>, N>>[]> {
			return parseCSVFromUrl(
				`https://docs.google.com/spreadsheets/d/${sheetsId}/gviz/tq?tqx=out:csv&sheet=${tableName}`,
				Type.Index(tablesSchema, [tableName]),
			);
		},
	};
}

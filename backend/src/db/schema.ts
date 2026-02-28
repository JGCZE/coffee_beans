import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  real,
  integer,
  varchar,
  primaryKey,
} from "drizzle-orm/pg-core";

export const beans = pgTable("beans", {
  bean_id: varchar("bean_id").primaryKey(),
  testing_profile: text("testing_profile").notNull(),
  bag_weight_g: real("bag_weight_g").notNull(),
  roast_index: integer("roast_index").notNull(),
  num_farms: integer("num_farms").notNull(),
  num_acidity_notes: integer("num_acidity_notes").notNull(),
  num_sweetness_notes: integer("num_sweetness_notes").notNull(),
  x: real("x").notNull(),
  y: real("y").notNull(),
});

export const customColumns = pgTable("custom_columns", {
  id: serial("id").primaryKey(),
  column_name: varchar("column_name").notNull().unique(),
  data_type: varchar("data_type").notNull().$type<'integer' | 'real' | 'string'>(),
});

export const beanCustomValues = pgTable(
  "bean_custom_values",
  {
    bean_id: varchar("bean_id")
      .notNull()
      .references(() => beans.bean_id),
    custom_column_id: integer("custom_column_id")
      .notNull()
      .references(() => customColumns.id),
    value: text("value").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.bean_id, table.custom_column_id] }),
  })
);

export const beansRelations = relations(beans, ({ many }) => ({
  customValues: many(beanCustomValues),
}));

export const customColumnsRelations = relations(customColumns, ({ many }) => ({
  beanValues: many(beanCustomValues),
}));

export const beanCustomValuesRelations = relations(
  beanCustomValues,
  ({ one }) => ({
    bean: one(beans, {
      fields: [beanCustomValues.bean_id],
      references: [beans.bean_id],
    }),
    customColumn: one(customColumns, {
      fields: [beanCustomValues.custom_column_id],
      references: [customColumns.id],
    }),
  })
);   
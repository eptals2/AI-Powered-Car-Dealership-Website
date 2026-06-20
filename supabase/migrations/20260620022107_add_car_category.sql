-- Add a category to cars: 'surplus' or 'commercial'.
-- Nullable, no default — existing rows stay uncategorized until set in the admin UI.

create type public.car_category as enum ('surplus', 'commercial');

alter table public.cars
  add column category public.car_category;

-- Seed minimal data for demo
insert into profiles (id, role, email, full_name, avatar_url)
values
  ('00000000-0000-0000-0000-000000000001','agent','agent@example.com','Demo Agent','https://i.pravatar.cc/100?img=1')
on conflict (id) do nothing;

insert into properties (id, agent_id, status, title, price, is_rental, suburb, address, bedrooms, bathrooms, parking, property_type, thumbnail_url)
values
  ('10000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','published','Modern 2BR Apartment in CBD',850000,false,'Sydney CBD','123 George St',2,2,1,'apartment','https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200'),
  ('10000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000001','published','Luxury Studio Loft',null,true,'Surry Hills','789 Crown St',1,1,0,'studio','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200')
on conflict (id) do nothing;

insert into property_media (property_id, media_type, area_name, url, thumbnail_url, duration_seconds, sort_order)
values
  ('10000000-0000-0000-0000-000000000001','hero',null,'https://storage.example.com/props/1/hero.mp4','https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',30,0),
  ('10000000-0000-0000-0000-000000000001','area','kitchen','https://storage.example.com/props/1/kitchen.mp4','https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',12,1),
  ('10000000-0000-0000-0000-000000000001','area','bedroom','https://storage.example.com/props/1/bedroom.mp4','https://images.unsplash.com/photo-1616594039964-ae9021a30b9b?w=800',10,2)
on conflict do nothing;
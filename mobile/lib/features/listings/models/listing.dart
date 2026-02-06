class Listing {
  final int id;
  final String title;
  final String? description;
  final double price;
  final String status;
  final Category? category;
  final City? city;
  final List<ListingImage> images;
  final UserSummary? user;

  Listing({
    required this.id,
    required this.title,
    this.description,
    required this.price,
    required this.status,
    this.category,
    this.city,
    required this.images,
    this.user,
  });

  factory Listing.fromJson(Map<String, dynamic> json) {
    return Listing(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      price: double.parse(json['price'].toString()),
      status: json['status'],
      category: json['category'] != null ? Category.fromJson(json['category']) : null,
      city: json['city'] != null ? City.fromJson(json['city']) : null,
      images: (json['images'] as List?)?.map((i) => ListingImage.fromJson(i)).toList() ?? [],
      user: json['user'] != null ? UserSummary.fromJson(json['user']) : null,
    );
  }
}

class Category {
  final int id;
  final String name;
  final String? slug;

  Category({required this.id, required this.name, this.slug});

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'],
      name: json['name'] ?? json['name_fr'] ?? 'Unknown',
      slug: json['slug'],
    );
  }
}

class City {
  final int id;
  final String name;

  City({required this.id, required this.name});

  factory City.fromJson(Map<String, dynamic> json) {
    return City(
      id: json['id'],
      name: json['name'] ?? json['name_fr'] ?? 'Unknown',
    );
  }
}

class ListingImage {
  final String url;

  ListingImage({required this.url});

  factory ListingImage.fromJson(Map<String, dynamic> json) {
    return ListingImage(url: json['image_path']);
  }
}

class UserSummary {
  final int id;
  final String fullName;
  final String? phone;

  UserSummary({required this.id, required this.fullName, this.phone});

  factory UserSummary.fromJson(Map<String, dynamic> json) {
    return UserSummary(
      id: json['id'],
      fullName: json['full_name'],
      phone: json['phone'],
    );
  }
}

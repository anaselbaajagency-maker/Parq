import 'package:flutter/material.dart';
import '../../core/theme/parq_theme.dart';

class ParqSkeleton extends StatefulWidget {
  final double width;
  final double height;
  final double borderRadius;

  const ParqSkeleton({
    super.key,
    this.width = double.infinity,
    this.height = 20,
    this.borderRadius = 8,
  });

  @override
  State<ParqSkeleton> createState() => _ParqSkeletonState();
}

class _ParqSkeletonState extends State<ParqSkeleton> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(milliseconds: 1500))..repeat();
    _animation = Tween<double>(begin: -2, end: 2).animate(_controller);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Container(
          width: widget.width,
          height: widget.height,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(widget.borderRadius),
            gradient: LinearGradient(
              begin: Alignment(_animation.value, 0),
              end: const Alignment(1, 0),
              colors: const [
                ParqColors.surface,
                Color(0xFFE2E8F0),
                ParqColors.surface,
              ],
            ),
          ),
        );
      },
    );
  }
}

class ListingCardSkeleton extends StatelessWidget {
  const ListingCardSkeleton({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const ParqSkeleton(height: 200, borderRadius: 16),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: const [
            ParqSkeleton(width: 150, height: 16),
            ParqSkeleton(width: 60, height: 16),
          ],
        ),
        const SizedBox(height: 8),
        const ParqSkeleton(width: 100, height: 12),
      ],
    );
  }
}

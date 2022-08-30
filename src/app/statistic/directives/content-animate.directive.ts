import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { animate, AnimationBuilder, AnimationPlayer, style } from '@angular/animations';

@Directive({
  selector: '[appContentAnimate]'
})
export class ContentAnimateDirective implements OnInit, OnDestroy {
  private player!: AnimationPlayer;

  constructor(
    private el: ElementRef,
    private animationBuilder: AnimationBuilder) {
  }

  ngOnInit(): void {
    this.initAnimate();
    this.player.play();
  }

  ngOnDestroy(): void {
    this.player.destroy();
  }

  initAnimate() {
    this.player = this.animationBuilder
      .build([
        style({
          top: '-30px',
          opacity: 0,
          position: 'relative',
          height: '100%'
        }),
        animate(
          '0.5s ease-in-out',
          style({ top: 0, opacity: 1 })
        )
      ])
      .create(this.el.nativeElement);
  }
}

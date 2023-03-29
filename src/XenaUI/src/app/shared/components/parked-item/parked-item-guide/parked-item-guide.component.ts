import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Module } from 'app/models/module';

@Component({
  selector: 'app-parked-item-guide',
  styleUrls: ['./parked-item-guide.component.scss'],
  templateUrl: './parked-item-guide.component.html',
})
export class ParkedItemGuideComponent implements OnInit, OnDestroy {
  @Input() usingModule: Module = null;

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {}
}

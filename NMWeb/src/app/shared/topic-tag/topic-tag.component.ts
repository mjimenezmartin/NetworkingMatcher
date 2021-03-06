import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-topic-tag',
  templateUrl: './topic-tag.component.html',
  styleUrls: ['./topic-tag.component.scss']
})
export class TopicTagComponent implements OnInit {

  @Input() tag;
  @Input() editable;
  @Input() tagListModel;

  constructor() { }

  ngOnInit() {
  }

}

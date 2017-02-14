/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 University of California San Diego
 * Author: Jim Robinson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * Created by dat on 2/3/17.
 */
var igv = (function (igv) {

    igv.TrackFileLoad = function () {

        var self = this,
            $box_input,
            $box,
            $fa_container,
            $fa,
            $input,
            $url_input_container,
            $e;

        // file load icon
        $fa_container = $('<div class="fa-container">');
        $fa = $('<i class="fa fa-upload fa-3x" aria-hidden="true">');
        $fa_container.append($fa);

        // file ingestion input
        $input = $('<input type="file" name="files[]" id="file" class="box__file" data-multiple-caption="{count} files selected" multiple="">');

        // afford selecting/drag-dropping track file
        this.$label = $('<label for="file">');
        $e = $('<strong>');
        $e.text('Choose a track file');
        this.$label.append($e);

        $e = $('<span class="box__dragndrop">');
        $e.text(' or drop it here');
        this.$label.append($e);

        // selected track visual feedback
        this.$chosenTrackLabel = $('<label for="file">');
        this.$chosenTrackLabel.hide();

        $box_input = $('<div class="box__input">');
        $box_input.append($fa_container);
        $box_input.append($input);
        $box_input.append(this.$label);
        $box_input.append(this.$chosenTrackLabel);

        // load selected track button
        this.$button = $('<button type="button" class="box__button">');
        this.$button.text('Load Track');
        this.$button.hide();
        $box_input.append(this.$button);

        $box = $('<div class="js igv-drag-and-drop-box">');

        $box.append($box_input);

        // Enter URL
        $url_input_container = $('<div class="igv-drag-and-drop-url-input-container">');
        $e = $('<div>');
        $e.text('or');
        this.$url_input = $('<input class="igv-drag-and-drop-url-input" placeholder="enter track URL">');
        $url_input_container.append($e);
        $url_input_container.append(this.$url_input);

        $box.append($url_input_container);

        this.$container = $('<div class="igv-drag-and-drop-container">');

        this.$container.append($box);

        this.$container.append( closeHandler() );

        function closeHandler() {

            var $container = $('<div class="igv-drag-and-drop-close-container">'),
                $fa = $('<i class="fa fa-times igv-drag-and-drop-close-fa">');

            $container.append($fa);

            $fa.hover(
                function () {
                    $fa.removeClass("fa-times");
                    $fa.addClass("fa-times-circle");

                    $fa.css({
                        "color": "#36464b"
                    });
                },

                function () {
                    $fa.removeClass("fa-times-circle");
                    $fa.addClass("fa-times");

                    $fa.css({
                        "color": "#92b0b3"
                    });

                }
            );

            $fa.on('click', function () {
                dismissDragAndDrop(self);
            });

            return $container;
        }

    };

    igv.TrackFileLoad.prototype.initializationHelper = function () {

        var self = this,
            $drag_and_drop,
            $input,
            droppedFile = undefined;

        $drag_and_drop = this.$container.find('.igv-drag-and-drop-box');

        $input = $drag_and_drop.find( 'input[type="file"]' );
        $input.on( 'change', function( e ) {

            droppedFile = _.first(e.target.files);

            // presentFileName(droppedFile);

            dismissDragAndDrop(self);
            igv.browser.loadTracksWithConfigList( [ { url: droppedFile } ] );

        });

        this.$button.on( 'click', function( e ) {

            dismissDragAndDrop(self);
            igv.browser.loadTracksWithConfigList( [ { url: droppedFile } ] );

        });

        this.$url_input.on( 'change', function( e ) {
            var value = $(this).val();

            dismissDragAndDrop(self);
            igv.browser.loadTracksWithConfigList( [ { url: value } ] );

        });

        $drag_and_drop
            .on( 'drag dragstart dragend dragover dragenter dragleave drop', function( e ) {
                e.preventDefault();
                e.stopPropagation();
            })
            .on( 'dragover dragenter', function() {
                $drag_and_drop.addClass( 'is-dragover' );
            })
            .on( 'dragleave dragend drop', function() {
                $drag_and_drop.removeClass( 'is-dragover' );
            })
            .on( 'drop', function( e ) {
                droppedFile = _.first(e.originalEvent.dataTransfer.files);

                // presentFileName(droppedFile);

                dismissDragAndDrop(self);
                igv.browser.loadTracksWithConfigList( [ { url: droppedFile } ] );

            });


        this.$dragAndDropPresentationButton = $('<div class="igv-drag-and-drop-presentation-button">');
        this.$dragAndDropPresentationButton.text('Load Track');

        this.$dragAndDropPresentationButton.on('click', function () {

            if (self.$container.is(':visible')) {
                dismissDragAndDrop(self);
            } else {
                presentDragAndDrop(self);
            }

        });

        function presentFileName(file) {

            var str;

            self.$label.hide();
            self.$chosenTrackLabel.text( file.name );
            self.$chosenTrackLabel.show();

            str = 'Load ' + file.name;
            self.$button.text(str);
            self.$button.show();

        }

    };

    function dismissDragAndDrop (thang) {

        thang.$url_input.val(undefined);

        thang.$button.text('Load Track');
        thang.$button.hide();

        thang.$chosenTrackLabel.hide();
        thang.$chosenTrackLabel.text('');
        thang.$label.show();

        thang.$container.hide();

    }

    function presentDragAndDrop (thang) {
        thang.$container.show();
    }

    return igv;
})(igv || {});